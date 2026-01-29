import { NextResponse } from 'next/server';

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
    try {
        const { propertyName, contactNumber, email } = await request.json();

        // Validate input
        if (!propertyName || !contactNumber || !email) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = generateOTP();

        // Store OTP with expiration (5 minutes)
        otpStore.set(email, {
            otp,
            propertyName,
            contactNumber,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        });

        // Send OTP via Brevo email service
        try {
            const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Rishikesh Rent</h1>
            <p style="color: white; margin: 10px 0 0 0; text-align: center;">Property Partner Registration</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2563eb; margin-top: 0;">Welcome to Rishikesh Rent!</h2>
            <p style="color: #374151; font-size: 16px;">Dear <strong>${propertyName}</strong>,</p>
            <p style="color: #374151; font-size: 16px;">Thank you for registering your property with us. To verify your email address, please use the following One-Time Password (OTP):</p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; margin: 30px 0; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h1 style="color: white; font-size: 48px; letter-spacing: 12px; margin: 0; font-weight: bold;">${otp}</h1>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⏰ Important:</strong> This OTP is valid for <strong>5 minutes only</strong>.
              </p>
            </div>
            
            <p style="color: #374151; font-size: 16px;">If you didn't request this OTP, please ignore this email or contact our support team.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Best regards,</p>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;"><strong>Rishikesh Rent Team</strong></p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
              This is an automated email. Please do not reply to this message.
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
              © ${new Date().getFullYear()} Rishikesh Rent. All rights reserved.
            </p>
          </div>
        </div>
      `;

            const brevoResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/brevo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    subject: 'Property Partner Registration - OTP Verification',
                    htmlContent: htmlContent,
                }),
            });

            if (!brevoResponse.ok) {
                throw new Error('Failed to send email via Brevo');
            }

            return NextResponse.json(
                {
                    message: 'OTP sent successfully to your email',
                    email: email
                },
                { status: 200 }
            );
        } catch (emailError) {
            console.error('Email sending error:', emailError);

            // For development, return OTP in response (remove in production)
            if (process.env.NODE_ENV === 'development') {
                return NextResponse.json(
                    {
                        message: 'OTP generated (email service unavailable)',
                        otp: otp, // Only for development
                        email: email
                    },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                { message: 'Failed to send OTP email' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
