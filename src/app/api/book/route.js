import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';    
import { cookies } from 'next/headers'; 

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    //GET THE LOGGED-IN USER ---
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated. Please log in.' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }
    
    const userId = decodedToken.userId; // We get the userId from the token

    // Get the rest of the data from the form
    const body = await request.json();
    const { lodgingId, roomTypeId, checkIn, checkOut, guestName, guestEmail, paymentId } = body;

    if (!lodgingId || !checkIn || !checkOut || !guestName || !guestEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const lodging = await prisma.lodging.findUnique({
      where: { id: parseInt(lodgingId) },
      select: { name: true }
    });

    if (!lodging) {
      return NextResponse.json({ error: 'Lodging not found' }, { status: 404 });
    }
    
    // SAVE BOOKING WITH THE USER ID 
    const booking = await prisma.booking.create({
      data: {
        lodgingId: parseInt(lodgingId),
        roomTypeId: parseInt(roomTypeId),
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guestName: guestName,
        guestEmail: guestEmail,
        paymentId: paymentId,
        userId: userId, 
      },
    });

    //Send confirmation email
    try {
      await resend.emails.send({
        from: 'Sajilo Yatra <booking@sajiloyatra.me>',
        to: guestEmail,
        subject: 'Your Sajilo Yatra Booking is Confirmed!',
        html: `Your booking is Confirmed. Thank You! haha` 
      });
    } catch (emailError) {
      console.error("Email failed to send:", emailError);
    }

    return NextResponse.json(booking, { status: 201 });

  } catch (error) {
    console.error('Booking API Error:', error);
    return NextResponse.json({ error: 'An error occurred while creating the booking.' }, { status: 500 });
  }
}