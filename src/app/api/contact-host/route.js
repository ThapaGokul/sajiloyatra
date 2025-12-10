import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { guideId, senderName, senderEmail, message } = body;

    if (!guideId || !senderName || !senderEmail || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Find the guide (and their User email)
    const guide = await prisma.localGuide.findUnique({
      where: { id: parseInt(guideId) },
      include: { user: true } 
    });

    if (!guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    // Save Message to Database (So it shows in their portal)
    await prisma.message.create({
      data: {
        senderName,
        senderEmail,
        content: message,
        guideId: parseInt(guideId),
      },
    });

    // Send Email Notification to the Host
    try {
      await resend.emails.send({
        from: 'Sajilo Yatra <booking@sajiloyatra.me>',
        to: guide.user.email, 
        subject: `New Inquiry from ${senderName}`,
        html: `
          <h2>New Message Received</h2>
          <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f9f9f9; padding: 10px; border-left: 3px solid #007bff;">
            ${message}
          </blockquote>
          <p>Log in to your profile to reply.</p>
        `
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}