import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

export default function MSG91OTPVerification({ phoneNumber: propPhoneNumber, onVerificationSuccess }) {
    const [phoneNumber, setPhoneNumber] = useState(propPhoneNumber || '');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

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

    // Send OTP to phone number
    const handleSendOTP = async () => {
        if (!phoneNumber || phoneNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile: phoneNumber }),
            });

            const data = await response.json();

            if (data.success) {
                setShowOtpInput(true);
                setResendTimer(30); // Start 30-second countdown
                toast.success('OTP sent successfully!');
            } else {
                toast.error(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobile: phoneNumber,
                    otp: otp
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Phone number verified successfully!');

                // Call the success callback
                if (onVerificationSuccess) {
                    onVerificationSuccess({
                        phoneNumber: `+91${phoneNumber}`,
                        verified: true
                    });
                }
            } else {
                toast.error(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error('Failed to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {!showOtpInput ? (
                // Phone Number Input
                <div className="space-y-3">
                    <Label htmlFor="phoneNumber">Mobile Number</Label>
                    <div className="flex gap-2">
                        <div className="flex items-center bg-gray-100 px-3 rounded-md border">
                            <span className="text-sm font-medium">+91</span>
                        </div>
                        <Input
                            id="phoneNumber"
                            type="tel"
                            placeholder="Enter 10-digit mobile number"
                            value={phoneNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 10) {
                                    setPhoneNumber(value);
                                }
                            }}
                            maxLength={10}
                            className="flex-1"
                            disabled={propPhoneNumber} // Disable if phone number is passed as prop
                        />
                    </div>
                    <Button
                        onClick={handleSendOTP}
                        disabled={loading || phoneNumber.length !== 10}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? 'Sending OTP...' : 'Get OTP'}
                    </Button>
                </div>
            ) : (
                // OTP Input
                <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                        OTP sent to +91 {phoneNumber}
                        <button
                            onClick={() => {
                                setShowOtpInput(false);
                                setOtp('');
                                setResendTimer(0);
                            }}
                            className="ml-2 text-blue-600 hover:underline"
                        >
                            Change number
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
                    </div>

                    <Button
                        onClick={handleVerifyOTP}
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-green-600 hover:bg-green-700"
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
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
