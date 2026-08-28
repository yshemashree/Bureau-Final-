import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Demo requests are temporarily unavailable' },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const { firstName, lastName, companyEmail, phone, jobTitle, useCase } = body;

    // Validate required fields
    if (!firstName || !lastName || !companyEmail || !phone || !jobTitle || !useCase) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Send email to yash.gajra@bureau.id
    await resend.emails.send({
      from: 'Bureau Demo Request <onboarding@resend.dev>',
      to: ['yash.gajra@bureau.id'],
      subject: `New Demo Request from ${firstName} ${lastName}`,
      html: `
        <h2>New Demo Request</h2>
        <p>A new demo request has been submitted with the following details:</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">First Name</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${firstName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Last Name</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company Email</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${companyEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Job Title</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${jobTitle}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Primary Use Case</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${useCase}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #666;">Please follow up with this lead as soon as possible.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending demo request email:', error);
    return NextResponse.json(
      { error: 'Failed to send demo request' },
      { status: 500 }
    );
  }
}
