'use client';

import React, { useState } from 'react';
import { PartnerIllustration } from '@/components/ui/partner-illustration';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PartnerRegister() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Initial form, 2: OTP verification
    const [formData, setFormData] = useState({
        propertyName: '',
        contactNumber: '',
        email: '',
        otp: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

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
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
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

            if (response.ok) {
                // Redirect to complete registration or dashboard
                router.push('/partner/complete-registration');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex w-[80%] mx-auto">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2">
                <PartnerIllustration />
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Properties With Us</h1>
                        </div>
                    </div>

                    {/* Register Form */}
                    <div className="space-y-6">
                        <div className="text-center lg:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {step === 1 ? 'Email For Register' : 'Verify Your Email'}
                            </h2>
                            <p className="text-gray-600">
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
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleGetOTP} className="space-y-5">
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
                                    <div className="flex gap-2">
                                        <div className="flex items-center justify-center bg-blue-600 text-white font-bold px-4 rounded-full text-lg">
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

                        {/* Already have account */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link href="/partner/login" className="text-blue-600 hover:text-blue-700 font-bold">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
