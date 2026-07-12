import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

export default function PhoneOTPVerification({ phoneNumber: propPhoneNumber, onVerificationSuccess }) {
    const [phoneNumber, setPhoneNumber] = useState(propPhoneNumber || '');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
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

    // Cleanup reCAPTCHA on unmount to prevent stale verifier issues
    useEffect(() => {
        return () => {
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                } catch (error) {
                    console.error('Error clearing reCAPTCHA:', error);
                }
                window.recaptchaVerifier = null;
            }
        };
    }, []);

    // Initialize reCAPTCHA
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response) => {
                        // reCAPTCHA solved
                        // console.log('reCAPTCHA solved');
                    },
                    'expired-callback': () => {
                        // Response expired
                        // console.log('reCAPTCHA expired');
                    }
                }
            );
        }
    };

    // Send OTP to phone number
    const handleSendOTP = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;

            // Format phone number with country code
            const formattedPhone = `+91${phoneNumber}`;

            const confirmationResult = await signInWithPhoneNumber(
                auth,
                formattedPhone,
                appVerifier
            );

            setConfirmationResult(confirmationResult);
            setShowOtpInput(true);
            setResendTimer(30); // Start 30-second countdown
            toast.success('OTP sent successfully!');
        } catch (error) {
            console.error('Error sending OTP:', error);

            // Reset reCAPTCHA on error
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }

            if (error.code === 'auth/invalid-phone-number') {
                toast.error('Invalid phone number format');
            } else if (error.code === 'auth/too-many-requests') {
                toast.error('Too many requests. Please try again later.');
            } else {
                toast.error('Failed to send OTP. Please try again.');
            }
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
            if (!confirmationResult) {
                throw new Error('No verification session found. Please request OTP again.');
            }
            const result = await confirmationResult.confirm(otp);

            // Call the success callback with user data
            if (onVerificationSuccess) {
                onVerificationSuccess({
                    phoneNumber: result.user.phoneNumber,
                    uid: result.user.uid
                });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);

            if (error.code === 'auth/invalid-verification-code') {
                toast.error('Invalid OTP. Please try again.');
            } else if (error.code === 'auth/code-expired') {
                toast.error('OTP expired. Please request a new one.');
            } else {
                toast.error('Verification failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* reCAPTCHA container (invisible) */}
            <div id="recaptcha-container"></div>

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
                                setConfirmationResult(null);
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
