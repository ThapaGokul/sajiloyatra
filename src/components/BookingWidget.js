"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import styles from './BookingWidget.module.css';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useAuth } from '../context/AuthContext';

//Get  Client ID from the .env file
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const EXCHANGE_RATE = 140;

export default function BookingWidget({ lodgingId, roomTypeId, lodgingName, lodgingPrice }) {

  const { user, isLoading } = useAuth(); // Get the user
  const router = useRouter(); // For redirection

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));

  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestEmail, setGuestEmail] = useState(user?.email || "");

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (user) {
      setGuestName(user.name);
      setGuestEmail(user.email);
    }
  }, [user]);


  const priceInNPR= (lodgingPrice || 5000);
  const priceInUSD = (priceInNPR / EXCHANGE_RATE).toFixed(2);

  // This function is called by PayPal when the user clicks the button
  const createOrder = (data, actions) => {
    if (!guestName || !guestEmail) {
      setMessage("Please fill in your name and email first.");
      setIsError(true);
      return Promise.reject(new Error("Invalid form"));
    }

    if (!user) {
      setMessage("Please log in to make a booking.");
      setIsError(true);
      // Redirect to login page
      router.push('/login');
      return Promise.reject(new Error("User not logged in"));
    }



    setMessage(null); // Clear any old messages
    
    return actions.order.create({
      purchase_units: [
        {
          description: `Booking for ${lodgingName}`,
          amount: {
            currency_code: "USD", 
            value: priceInUSD,
          },
        },
      ],
    });
  };

  // This function is called after the user approves the payment
  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      console.log("Payment successful:", details);
      
      // We will now call our *own* API to save the booking
      // and send the confirmation email.
      
      try {
        const response = await fetch('/api/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lodgingId: lodgingId,
            roomTypeId: roomTypeId,
            checkIn: startDate,
            checkOut: endDate,
            guestName: guestName,
            guestEmail: guestEmail,
            paymentId: details.id, 
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save booking to database.");
        }


        setMessage(`Booking successful! Payment ID: ${details.id}`);
        setIsError(false);

      } catch (error) {
        console.error("Booking save error:", error);
        setMessage("Payment was successful, but we had an error saving your booking.");
        setIsError(true);
      }
    });
  };

  // This function is called if the user has an error in the PayPal pop-up
  const onError = (err) => {
    console.error("PayPal Error:", err);
    setMessage("An error occurred with the payment.");
    setIsError(true);
  };

  if (!PAYPAL_CLIENT_ID) {
    return <div>Error: PayPal Client ID is not configured.</div>;
  }
  if (isLoading) {
    return <div className={styles.widget}>Loading...</div>
  }

  return (
    <div className={styles.widget}>
      <h3>Book Your Stay</h3>
      
      <div className={styles.datePickers}>
        <div className={styles.inputGroup}>
          <label>Check-in</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            className={styles.dateInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Check-out</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className={styles.dateInput}
          />
        </div>
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="guestName">Full Name</label>
        <input
          type="text" id="guestName" className={styles.input}
          value={guestName} onChange={(e) => setGuestName(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="guestEmail">Email</label>
        <input
          type="email" id="guestEmail" className={styles.input}
          value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)}
        />
      </div>

      {message && (
        <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      {/* THE PAYPAL COMPONENT */}
      <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
        />
      </PayPalScriptProvider>
    </div>
  );
}