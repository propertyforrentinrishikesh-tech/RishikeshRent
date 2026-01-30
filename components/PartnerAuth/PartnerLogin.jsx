'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function PartnerLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        hotelCode: '',
        userCode: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/hotel-partner-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hotelCode: formData.hotelCode,
                    username: formData.userCode,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Store property data in session/localStorage
                localStorage.setItem('partnerProperty', JSON.stringify(data.property));

                // Redirect to partner dashboard
                router.push('/partner/hotel_property_updates');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex w-[80%] mx-auto">
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 ">
                <div className="relative w-full max-w-2xl">
                    {/* Header Text */}
                    <div className="text-center">
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">Your Properties With Us</h1>
                        <div className="inline-flex items-center rounded-full overflow-hidden border-2 border-gray-800 shadow-lg">
                            <div className="px-8 py-2 bg-blue-500 text-black font-bold text-lg">
                                Login
                            </div>
                            <p className="px-8 py-2 bg-orange-500 text-black font-bold text-lg transition-colors">
                                Extranet
                            </p>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="relative w-full aspect-square max-w-md mx-auto">
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            List Your Holiday Rental
                        </h2>
                        <p className="text-base text-justify text-gray-700 max-w-xl mx-auto">
                            Open your door to rental income. Benefit from 20 years of expertise.
                            Sign up now. You&apos;re in control - open and close your property for
                            bookings when you want.
                        </p>
                    </div>
                </div>
            </div>
            <div className="border-r-2 border-gray-800 h-[85vh] my-auto"></div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Illustration */}
                    <div className="lg:hidden mb-8">
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Properties With Us</h1>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="space-y-6">
                        <div className="">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Extranet Login</h2>
                            <p className="text-gray-600 text-center">Sign in to manage your property</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Hotel Code */}
                            <div>
                                <label htmlFor="hotelCode" className="block text-sm font-bold text-gray-900 mb-2">
                                    Hotel Code
                                </label>
                                <Input
                                    id="hotelCode"
                                    name="hotelCode"
                                    type="text"
                                    required
                                    value={formData.hotelCode}
                                    onChange={handleChange}
                                    placeholder="Type Your Property Code"
                                    className="w-full px-4 py-5 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-yellow-50"
                                />
                            </div>

                            {/* User Code */}
                            <div>
                                <label htmlFor="userCode" className="block text-sm font-bold text-gray-900 mb-2">
                                    User Code
                                </label>
                                <Input
                                    id="userCode"
                                    name="userCode"
                                    type="text"
                                    required
                                    value={formData.userCode}
                                    onChange={handleChange}
                                    placeholder="Type Your Property Code"
                                    className="w-full px-4 py-5 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-yellow-50"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Type Your Property Code"
                                        className="w-full px-4 py-5 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-yellow-50 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Sign In Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 rounded-md text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Or</span>
                            </div>
                        </div>

                        {/* Register Section */}
                        <div className="space-y-1">
                            <p className="text-center text-gray-700">
                                Sign up and start welcoming guests today!
                            </p>

                            <h3 className="text-xl font-bold text-gray-900">Register for free</h3>

                            <div className="space-y-2">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700">45% of hosts get their first booking within a week</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700">Choose instant bookings or Request to Book</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700">We&apos;ll facilitate payments for you</p>
                                </div>
                            </div>

                            <Link href="/partner/register">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 my-5">
                                    Get started now
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
