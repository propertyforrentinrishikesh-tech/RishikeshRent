import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

export default function EmailOTPVerification({ email: propEmail, onVerificationSuccess }) {
    const [email, setEmail] = useState(propEmail || '');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [generatedOTP, setGeneratedOTP] = useState('');

    // Countdown timer for resend OTP
    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // Generate 6-digit OTP
    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Send OTP to email
    const handleSendOTP = async () => {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            // Generate OTP
            const newOTP = generateOTP();
            setGeneratedOTP(newOTP);

            // Send email via Brevo
            const response = await fetch('/api/brevo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    subject: 'Property Verification OTP - Rishikesh Rent',
                    htmlContent: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                                .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
                                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                                .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>🏠 Rishikesh Rent</h1>
                                    <p>Property Verification</p>
                                </div>
                                <div class="content">
                                    <h2>Hello!</h2>
                                    <p>You have requested to verify your property listing. Please use the OTP below to complete the verification process.</p>
                                    
                                    <div class="otp-box">
                                        <p style="margin: 0; color: #666;">Your Verification OTP</p>
                                        <div class="otp-code">${newOTP}</div>
                                        <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Valid for 5 minutes</p>
                                    </div>
                                    
                                    <div class="warning">
                                        <strong>⚠️ Security Notice:</strong><br>
                                        • Do not share this OTP with anyone<br>
                                        • This OTP is valid for 5 minutes only
                                    </div>
                                    
                                    <p>If you didn't request this OTP, please ignore this email.</p>
                                    
                                    <div class="footer">
                                        <p>© ${new Date().getFullYear()} Rishikesh Rent. All rights reserved.</p>
                                        <p>This is an automated email. Please do not reply.</p>
                                    </div>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                }),
            });

            const data = await response.json();

            if (data.success) {
                setShowOtpInput(true);
                setResendTimer(30); // Start 30-second countdown
                toast.success('OTP sent to your email!');
            } else {
                toast.error('Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOTP = () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        // Verify OTP matches
        if (otp === generatedOTP) {
            // Call the success callback
            if (onVerificationSuccess) {
                onVerificationSuccess({
                    email: email,
                    verified: true
                });
            }
        } else {
            toast.error('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="space-y-4">
            {!showOtpInput ? (
                // Email Input
                <div className="space-y-3">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1"
                        disabled={propEmail} // Disable if email is passed as prop
                    />
                    <Button
                        onClick={handleSendOTP}
                        disabled={loading || !email}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP to Email'}
                    </Button>
                </div>
            ) : (
                // OTP Input
                <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                        OTP sent to {email}
                        <button
                            onClick={() => {
                                setShowOtpInput(false);
                                setOtp('');
                                setResendTimer(0);
                                setGeneratedOTP('');
                            }}
                            className="ml-2 text-blue-600 hover:underline"
                        >
                            Change email
                        </button>
                    </div>

                    <div>
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 6) {
                                    setOtp(value);
                                }
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && otp.length === 6) {
                                    handleVerifyOTP();
                                }
                            }}
                            maxLength={6}
                            className="text-center text-lg tracking-widest"
                        />
                        <p className="text-xs text-gray-500 mt-1">Check your email inbox (and spam folder)</p>
                    </div>

                    <Button
                        onClick={handleVerifyOTP}
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        Verify OTP
                    </Button>

                    <button
                        onClick={handleSendOTP}
                        disabled={loading || resendTimer > 0}
                        className={`w-full text-sm ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'}`}
                    >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                </div>
            )}
        </div>
    );
}
