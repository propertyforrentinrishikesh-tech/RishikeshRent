import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDB';
import PartnerUser from '@/models/PartnerUser';

export async function POST(request) {
    try {
        await connectDB();

        const { propertyName, contactNumber, email } = await request.json();

        // Validate input
        if (!propertyName || !contactNumber || !email) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Check if partner already exists
        const existingPartner = await PartnerUser.findOne({
            email: email.toLowerCase().trim(),
            contactNumber: contactNumber.trim()
        });

        if (existingPartner) {
            return NextResponse.json(
                {
                    message: 'Partner account already exists',
                    alreadyExists: true
                },
                { status: 409 }
            );
        }

        // Create new partner user (without credentials - admin will generate later)
        const newPartner = await PartnerUser.create({
            propertyName: propertyName.trim(),
            email: email.toLowerCase().trim(),
            contactNumber: contactNumber.trim(),
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
            status: 'pending-verification' // Admin needs to approve and generate credentials
        });

        // Send confirmation email
        try {
            const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">🎉 Welcome to Rishikesh Rent!</h1>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #10b981; margin-top: 0;">Registration Received!</h2>
            <p style="color: #374151; font-size: 16px;">Dear <strong>${propertyName}</strong>,</p>
            <p style="color: #374151; font-size: 16px;">Thank you for registering your property with Rishikesh Rent. We have received your registration request.</p>
            
            <div style="background-color: #f3f4f6; padding: 25px; border-radius: 10px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #1f2937;">Registration Details:</h3>
              <div style="margin-bottom: 10px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Property Name</p>
                <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px; font-weight: bold;">${propertyName}</p>
              </div>
              <div style="margin-bottom: 10px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Email</p>
                <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px; font-weight: bold;">${email}</p>
              </div>
              <div>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Contact Number</p>
                <p style="margin: 5px 0 0 0; color: #1f2937; font-size: 16px; font-weight: bold;">+91 ${contactNumber}</p>
              </div>
            </div>
            
            <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>� What's Next?</strong><br/>
                Our team will review your registration and generate your login credentials. You will receive an email with your Hotel Code, Username, and Password once admin approves your registration.
              </p>
            </div>
            
            <p style="color: #374151; font-size: 16px; margin-top: 25px;">Once approved, you'll be able to:</p>
            <ul style="color: #374151; font-size: 16px; line-height: 1.8;">
              <li>Access your partner dashboard</li>
              <li>Complete your property details</li>
              <li>Upload property images</li>
              <li>Manage room availability</li>
              <li>Start receiving bookings!</li>
            </ul>
            
            <p style="color: #374151; font-size: 16px;">If you have any questions, feel free to contact our support team.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Best regards,</p>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;"><strong>Rishikesh Rent Team</strong></p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 10px; padding: 20px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
              This is an automated email. Please do not reply to this message.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
              © ${new Date().getFullYear()} Rishikesh Rent. All rights reserved.
            </p>
          </div>
        </div>
      `;

            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/brevo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    subject: 'Registration Received - Rishikesh Rent Partner',
                    htmlContent: htmlContent,
                }),
            });
        } catch (emailError) {
            console.error('Confirmation email error:', emailError);
            // Continue even if email fails
        }

        // Return success
        return NextResponse.json(
            {
                success: true,
                message: 'Registration successful! You will receive your login credentials via email within 24-48 hours.',
                partner: {
                    email: newPartner.email,
                    propertyName: newPartner.propertyName,
                    status: newPartner.status
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Partner registration error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Registration failed. Please try again.'
            },
            { status: 500 }
        );
    }
}
