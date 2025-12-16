import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookingWidget from '../components/BookingWidget'; 


// Mock Next.js Router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Auth Context
const mockUseAuth = jest.fn();
jest.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock PayPal
jest.mock('@paypal/react-paypal-js', () => ({
  PayPalScriptProvider: ({ children }) => <div>{children}</div>,
  PayPalButtons: ({ createOrder, onApprove, onError }) => (
    <button
      data-testid="paypal-mock-btn"
      onClick={async () => {
        try {
          // Simulate createOrder logic
        
          const actionsMock = {
            order: {
              create: jest.fn().mockResolvedValue("ORDER_ID_123"),
              capture: jest.fn().mockResolvedValue({ id: "PAYMENT_ID_ABC" }) 
            }
          };
          
          await createOrder({}, actionsMock);
          
          //  Simulate onApprove logic (Payment Success)
          await onApprove({}, actionsMock);
          
        } catch (err) {
            if (onError) onError(err);
        }
      }}
    >
      Pay with PayPal
    </button>
  ),
}));

global.fetch = jest.fn();


describe('BookingWidget Component', () => {
  const defaultProps = {
    lodgingId: '101',
    roomTypeId: '202',
    lodgingName: 'Himalayan Lodge',
    lodgingPrice: 14000 
  };

  beforeEach(() => {
    jest.clearAllMocks();
  
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID = "test-client-id";
  });

  // RENDER & AUTO-FILL 
  it('renders correctly and auto-populates user data from AuthContext', () => {
    mockUseAuth.mockReturnValue({
      user: { name: 'John Doe', email: 'john@example.com' },
      isLoading: false
    });

    render(<BookingWidget {...defaultProps} />);

    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');
    expect(screen.getByText('Book Your Stay')).toBeInTheDocument();
  });

  //  VALIDATION ERROR 
  it('shows error if name/email is missing', async () => {
    // Mock user but empty fields manually
    mockUseAuth.mockReturnValue({ user: { name: '', email: '' }, isLoading: false });

    render(<BookingWidget {...defaultProps} />);

    // Clear inputs manually
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: '' } });

    // Click PayPal button
    const payButton = screen.getByTestId('paypal-mock-btn');
    fireEvent.click(payButton);

    // Expect Error Message
    await waitFor(() => {
        expect(screen.getByText("Please fill in your name and email first.")).toBeInTheDocument();
    });
  });

  // AUTH GUARD
  it('redirects to login if user is not authenticated', async () => {
    // Mock NO user
    mockUseAuth.mockReturnValue({ user: null, isLoading: false });

    render(<BookingWidget {...defaultProps} />);

    // Fill inputs so validation passes, but Auth check fails
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Guest User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'guest@example.com' } });

    // Click PayPal
    const payButton = screen.getByTestId('paypal-mock-btn');
    fireEvent.click(payButton);

    await waitFor(() => {
        expect(screen.getByText("Please log in to make a booking.")).toBeInTheDocument();
        expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  //  SUCCESSFUL BOOKING 
  it('calls API and shows success message on valid payment', async () => {
    // Mock logged-in user
    mockUseAuth.mockReturnValue({
      user: { name: 'Jane Doe', email: 'jane@example.com' },
      isLoading: false
    });

    // Mock successful API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ bookingId: 123 }),
    });

    render(<BookingWidget {...defaultProps} />);

    // Click Pay
    const payButton = screen.getByTestId('paypal-mock-btn');
    
    await act(async () => {
      fireEvent.click(payButton);
    });

    await waitFor(() => {
       // Verify Fetch was called with correct endpoint and JSON body
       expect(global.fetch).toHaveBeenCalledWith('/api/book', expect.objectContaining({
           method: 'POST',
           body: expect.stringContaining('"paymentId":"PAYMENT_ID_ABC"')
       }));
       
       // Verify Success Message UI
       expect(screen.getByText(/Booking successful! Payment ID: PAYMENT_ID_ABC/i)).toBeInTheDocument();
    });
  });

  //  API FAILURE HANDLING 
  it('shows error if backend API fails after payment', async () => {
    mockUseAuth.mockReturnValue({
      user: { name: 'Jane Doe', email: 'jane@example.com' },
      isLoading: false
    });

    // Mock FAILED API response (e.g. Database down)
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<BookingWidget {...defaultProps} />);

    const payButton = screen.getByTestId('paypal-mock-btn');
    await act(async () => {
      fireEvent.click(payButton);
    });

    await waitFor(() => {
       expect(screen.getByText("Payment was successful, but we had an error saving your booking.")).toBeInTheDocument();
    });
  });
});