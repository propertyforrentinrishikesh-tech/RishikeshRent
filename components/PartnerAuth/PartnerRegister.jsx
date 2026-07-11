'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PartnerRegister() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        propertyName: '',
        contactNumber: '',
        email: '',
        otp: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [countdown, setCountdown] = useState(0);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0 && success && success.includes('Registration successful')) {
            router.push('/partner/hostel_registration');
        }
        return () => clearInterval(timer);
    }, [countdown, success, router]);

    const handleGetOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/partner/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyName: formData.propertyName,
                    contactNumber: formData.contactNumber,
                    email: formData.email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('OTP sent successfully to your email!');
                setStep(2);
            } else {
                // Check if user already exists
                if (data.alreadyExists) {
                    setError(
                        <span>
                            {data.message}{' '}
                            {/* <Link href="/partner/login" className="text-blue-600 hover:text-blue-700 font-bold underline">
                                Click here to login
                            </Link> */}
                        </span>
                    );
                } else {
                    setError(data.message || 'Failed to send OTP');
                }
            }
        } catch (err) {
            console.error('Send OTP error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/partner/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Show success message
                setSuccess(
                    'Registration successful!'
                );

                // Clear form
                setFormData({
                    propertyName: '',
                    contactNumber: '',
                    email: '',
                    otp: '',
                });

                // Start countdown for redirect
                setCountdown(5);
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
            <div className="flex w-full max-w-6xl bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                {/* Left Side - Illustration */}
                <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-slate-50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.05),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.05),_transparent_40%)]" />
                    <div className="relative w-full max-w-lg z-10 flex flex-col items-center">
                        {/* Header Text */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800 mb-6">Your Properties With Us</h1>
                            <div className="inline-flex items-center rounded-full overflow-hidden border border-slate-200 shadow-sm bg-white p-1">
                                <div className="px-6 py-2 bg-blue-600 text-white font-semibold text-sm rounded-full">
                                    Register
                                </div>
                                <p className="px-6 py-2 text-slate-600 font-medium text-sm">
                                    Extranet
                                </p>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative w-full aspect-[4/3] mb-8">
                            <Image
                                src="/partnerregister.png"
                                alt="List Your Holiday Rental"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Bottom Text */}
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                List Your Holiday Rental
                            </h2>
                            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                                Open your door to rental income. Benefit from 20 years of expertise.
                                Sign up now. You're in control - open and close your property for
                                bookings when you want.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-md">
                        {/* Mobile Header */}
                        <div className="lg:hidden mb-8">
                            <div className="text-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Properties With Us</h1>
                            </div>
                        </div>

                        {/* Register Form */}
                        <div className="space-y-8">
                            <div className="text-center lg:text-left">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                    {step === 1 ? 'Create an Account' : 'Verify Your Email'}
                                </h2>
                                <p className="text-slate-500">
                                    {step === 1
                                        ? 'Enter your details below to get started'
                                        : 'Enter the 6-digit OTP sent to your email'}
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50/50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-emerald-50/50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                        {success}
                                    </div>
                                    {countdown > 0 && (
                                        <p className="ml-7 text-xs text-emerald-500 font-semibold">
                                            Redirecting to registration page in {countdown} seconds...
                                        </p>
                                    )}
                                </div>
                            )}

                            {step === 1 ? (
                                <form onSubmit={handleGetOTP} className="space-y-5">
                                    {/* Property Name */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="propertyName" className="block text-sm font-medium text-slate-700">
                                            Property Name
                                        </label>
                                        <Input
                                            id="propertyName"
                                            name="propertyName"
                                            type="text"
                                            required
                                            value={formData.propertyName}
                                            onChange={handleChange}
                                            placeholder="e.g. Ganga View Residency"
                                            className="w-full px-4 h-12 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50 hover:bg-white"
                                        />
                                    </div>

                                    {/* Contact Number */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="contactNumber" className="block text-sm font-medium text-slate-700">
                                            Contact Number
                                        </label>
                                        <div className="flex relative">
                                            <div className="absolute left-0 inset-y-0 flex items-center justify-center px-4 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 font-medium">
                                                +91
                                            </div>
                                            <Input
                                                id="contactNumber"
                                                name="contactNumber"
                                                type="tel"
                                                required
                                                pattern="[0-9]{10}"
                                                value={formData.contactNumber}
                                                onChange={handleChange}
                                                placeholder="98765 43210"
                                                className="w-full pl-16 pr-4 h-12 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50 hover:bg-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5 pb-2 gap-2">
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                            Email Address
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className="w-full px-4 h-12 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50 hover:bg-white mb-4"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 rounded-xl transition-all active:scale-[0.98]"
                                        >
                                            {loading ? 'Sending...' : 'Get Verification Code'}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2 text-center">
                                        security codes sent directly to your email address<br />
                                        by the website for using to verify your identity.
                                    </p>
                            </form>
                        ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-5">
                            {/* OTP Input */}
                            <div className="space-y-1.5">
                                <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                                    Enter Verification Code
                                </label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={formData.otp}
                                    onChange={handleChange}
                                    placeholder="Enter 6-digit OTP"
                                    className="w-full px-4 h-14 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-slate-50/50 hover:bg-white text-center text-2xl tracking-[0.5em] font-semibold text-slate-900"
                                />
                            </div>

                            {/* Verify Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-12 rounded-xl transition-all active:scale-[0.98]"
                            >
                                {loading ? 'Verifying...' : 'Verify & Continue'}
                            </Button>

                            {/* Resend OTP */}
                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors"
                                >
                                    Didn't receive code? <span className="underline">Resend</span>
                                </button>
                            </div>
                        </form>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
