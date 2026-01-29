import React from 'react';

export const PartnerIllustration = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white">
            <div className="mb-6">
                <div className="inline-flex items-center rounded-full overflow-hidden border-2 border-gray-800 shadow-lg">
                    <button className="px-8 py-3 bg-blue-500 text-white font-bold text-lg transition-colors hover:bg-blue-600">
                        Register
                    </button>
                    <div className="w-px h-8 bg-gray-800"></div>
                    <button className="px-8 py-3 bg-orange-500 text-white font-bold text-lg transition-colors hover:bg-orange-600">
                        Extranet
                    </button>
                </div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Background Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-80 h-80 bg-blue-100 rounded-full opacity-60"></div>
                </div>

                {/* Illustration Content */}
                <div className="relative z-10 flex items-center justify-center py-12">
                    {/* Airplane Ticket */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-200 rounded-lg p-4 shadow-lg w-48 transform -rotate-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="h-2 bg-orange-300 rounded mb-1"></div>
                                <div className="h-2 bg-orange-300 rounded w-3/4"></div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <div className="h-2 bg-orange-300 rounded flex-1"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <div className="h-2 bg-orange-300 rounded flex-1"></div>
                            </div>
                        </div>
                    </div>

                    {/* Phone/Tablet Device */}
                    <div className="bg-gray-900 rounded-2xl p-3 shadow-2xl w-40 transform translate-x-4">
                        <div className="bg-white rounded-lg p-3 h-56">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                                <div className="w-6 h-6 bg-orange-400 rounded"></div>
                                <div className="flex-1 space-y-1">
                                    <div className="h-1.5 bg-orange-300 rounded"></div>
                                    <div className="h-1.5 bg-orange-300 rounded w-2/3"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1 space-y-1">
                                        <div className="h-1.5 bg-gray-300 rounded"></div>
                                        <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1 space-y-1">
                                        <div className="h-1.5 bg-gray-300 rounded"></div>
                                        <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Person with Phone */}
                    <div className="relative z-20 ml-8">
                        <div className="flex flex-col items-center">
                            {/* Head */}
                            <div className="relative">
                                <div className="w-16 h-20 bg-amber-100 rounded-full"></div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-8 bg-gray-900 rounded-t-full"></div>
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-200 rounded-full"></div>
                                {/* Eyes */}
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
                                    <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-900 rounded-full"></div>
                                </div>
                                {/* Mouth */}
                                <div className="absolute top-11 left-1/2 -translate-x-1/2 w-3 h-1 bg-gray-900 rounded-full"></div>
                            </div>

                            {/* Body */}
                            <div className="w-24 h-32 bg-blue-400 rounded-t-3xl relative -mt-2">
                                {/* Arm with phone */}
                                <div className="absolute -left-2 top-8 w-6 h-16 bg-blue-400 rounded-full transform -rotate-12"></div>
                                <div className="absolute -left-6 top-20 w-4 h-6 bg-amber-200 rounded"></div>
                                <div className="absolute -left-8 top-18 w-6 h-10 bg-gray-900 rounded-lg"></div>

                                {/* Other arm */}
                                <div className="absolute -right-2 top-8 w-6 h-20 bg-orange-400 rounded-full transform rotate-12"></div>
                                <div className="absolute -right-4 top-24 w-4 h-6 bg-amber-200 rounded"></div>
                            </div>

                            {/* Legs */}
                            <div className="flex gap-2 -mt-1">
                                <div className="w-10 h-20 bg-gray-900 rounded-b-3xl"></div>
                                <div className="w-10 h-20 bg-gray-900 rounded-b-3xl"></div>
                            </div>

                            {/* Shoes */}
                            <div className="flex gap-2 -mt-1">
                                <div className="w-12 h-4 bg-gray-800 rounded-full"></div>
                                <div className="w-12 h-4 bg-gray-800 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Suitcase */}
                     <div className="absolute right-0 bottom-8 bg-blue-500 rounded-lg w-16 h-24 shadow-lg">
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-blue-600 rounded"></div>
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 border-4 border-blue-300 rounded"></div>
                        <div className="absolute bottom-2 left-2 right-2 h-1 bg-blue-600 rounded"></div>
                        {/* Wheels */}
                        <div className="absolute -bottom-2 left-2 w-3 h-3 bg-gray-800 rounded-full"></div>
                        <div className="absolute -bottom-2 right-2 w-3 h-3 bg-gray-800 rounded-full"></div>
                        {/* Handle */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1 h-8 bg-gray-700"></div>
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-6 h-3 bg-gray-700 rounded-t-full"></div>
                    </div> 
                </div>
            </div>

            {/* <div className="mt-8 text-center max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    List Your Holiday Rental
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                    Open your door to rental income. Benefit from 20 years of expertise.
                    Sign up now. You&apos;re in control - open and close your property for
                    bookings when you want.
                </p>
            </div> */}
        </div>
    );
};
