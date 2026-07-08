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
                            <Link href="/partner/login" className="text-blue-600 hover:text-blue-700 font-bold underline">
                                Click here to login
                            </Link>
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
        <div className="min-h-[50vh] flex w-[80%] mx-auto">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-2 ">
                <div className="relative w-full max-w-2xl my-5">
                    {/* Header Text */}
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-gray-900 mb-4">Your Properties With Us</h1>
                        <div className="inline-flex items-center rounded-full overflow-hidden border-2 border-gray-800 shadow-lg">
                            <div className="px-5 py-1 bg-blue-500 text-black font-bold text-lg">
                                Register
                            </div>
                            <p className="px-5 py-1 bg-orange-500 text-black font-bold text-lg transition-colors">
                                Extranet
                            </p>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative w-full aspect-square max-w-sm mx-auto">
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
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            List Your Holiday Rental
                        </h2>
                        <p className="text-sm text-justify text-gray-700 max-w-xl mx-auto">
                            Open your door to rental income. Benefit from 20 years of expertise.
                            Sign up now. You&apos;re in control - open and close your property for
                            bookings when you want.
                        </p>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block border-r-2 border-gray-800 h-[70vh] my-auto"></div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-5 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Properties With Us</h1>
                        </div>
                    </div>

                    {/* Register Form */}
                    <div className="space-y-6">
                        <div className="w-full lg:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                {step === 1 ? 'Email For Register' : 'Verify Your Email'}
                            </h2>
                            <p className="text-gray-600 text-center">
                                {step === 1
                                    ? 'Enter your details to get started'
                                    : 'Enter the OTP sent to your email'}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                {success}
                                {countdown > 0 && (
                                    <p className="mt-2 font-bold text-sm">
                                        Redirecting to registration page in {countdown} seconds...
                                    </p>
                                )}
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleGetOTP} className="space-y-2">
                                {/* Property Name */}
                                <div>
                                    <label htmlFor="propertyName" className="block text-sm font-bold text-gray-900 mb-2">
                                        Property Name
                                    </label>
                                    <Input
                                        id="propertyName"
                                        name="propertyName"
                                        type="text"
                                        required
                                        value={formData.propertyName}
                                        onChange={handleChange}
                                        placeholder="Your Property Name"
                                        className="w-full px-4 py-5 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-100"
                                    />
                                </div>

                                {/* Contact Number */}
                                <div>
                                    <label htmlFor="contactNumber" className="block text-sm font-bold text-gray-900 mb-2">
                                        Contact Number
                                    </label>
                                    <div className="flex gap-1">
                                        <div className="flex items-center justify-center bg-blue-600 text-white font-bold px-4 rounded-md text-lg">
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
                                            placeholder="Your Official Contact Number"
                                            className="flex-1 px-4 py-5 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-100"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                                        Email Address
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Type Your Email Here"
                                            className="flex-1 px-4 py-5 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-100"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-5 rounded-md text-base transition-all transform hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                                        >
                                            {loading ? 'Sending...' : 'Get OTP'}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2 text-center">
                                        security codes sent directly to your email address<br />
                                        by the website for using to verify your identity.
                                    </p>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="space-y-5">
                                {/* OTP Input */}
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-bold text-gray-900 mb-2">
                                        Enter OTP
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
                                        className="w-full px-4 py-5 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-gray-100 text-center text-2xl tracking-widest"
                                    />
                                </div>

                                {/* Verify Button */}
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-md text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Continue'}
                                </Button>

                                {/* Resend OTP */}
                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                                    >
                                        Didn&apos;t receive OTP? Resend
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
