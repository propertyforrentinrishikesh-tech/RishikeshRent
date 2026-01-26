"use client"
import React, { useState } from 'react'
import { Eye, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ConfirmNoShow = () => {
    const [expandedBooking, setExpandedBooking] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState('')

    const bookings = [
        {
            id: 1,
            name: 'Reservation Details',
            checkIn: 'Date DD/MM/YY',
            checkOut: 'Date DD/MM/YY',
            guestName: 'Guest Name Here',
            callNumber: '**********',
            bookingNumber: '123456789',
            dateOfBooking: 'DD/MM/YY',
            bookingPrice: 'Rs. 15000'
        },
        { id: 2, name: 'Name', dateOfBooking: 'DD/MM/YY', bookingPrice: 'Rs. 8000' },
        { id: 3, name: 'Name', dateOfBooking: 'DD/MM/YY', bookingPrice: 'Rs. 6000' },
        { id: 4, name: 'Name', dateOfBooking: 'DD/MM/YY', bookingPrice: 'Rs. 12000' },
        { id: 5, name: 'Name', dateOfBooking: 'DD/MM/YY', bookingPrice: 'Rs. 4000' }
    ]

    const toggleBooking = (id) => {
        setExpandedBooking(expandedBooking === id ? null : id)
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Or No Show</h1>
                <p className="text-sm text-gray-600">A standard industry policy</p>
                <p className="text-sm text-gray-700 mt-2">
                    <strong>The Deadline:</strong> A guest is usually considered a "No-Show" if they haven't arrived by a specific time (e.g., 11:59 PM on the arrival date or 2:00 AM after the night audit).
                </p>
            </div>

            {/* Bookings Table */}
            <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 bg-cyan-400 p-3 rounded-lg font-bold text-gray-900">
                    <div className="col-span-1 text-center">Sno.</div>
                    <div className="col-span-4">Name</div>
                    <div className="col-span-3 text-center">Date Of Booking</div>
                    <div className="col-span-3 text-center">Booking Price</div>
                    <div className="col-span-1 text-center">
                        <Eye className="h-5 w-5 inline" />
                    </div>
                </div>

                {/* Booking Rows */}
                {bookings.map((booking) => (
                    <div key={booking.id} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                        {/* Booking Header Row */}
                        <div className="grid grid-cols-12 gap-2 bg-yellow-300 p-3 items-center">
                            <div className="col-span-1 text-center font-bold">
                                {String(booking.id).padStart(2, '0')}
                            </div>
                            <div className="col-span-4 font-semibold">{booking.name}</div>
                            <div className="col-span-3 text-center">{booking.dateOfBooking}</div>
                            <div className="col-span-3 text-center font-semibold">{booking.bookingPrice}</div>
                            <div className="col-span-1 text-center">
                                <button
                                    onClick={() => toggleBooking(booking.id)}
                                    className="p-1 hover:bg-yellow-400 rounded"
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedBooking === booking.id && booking.id === 1 && (
                            <div className="bg-gray-50 p-6">
                                <div className="space-y-4 max-w-2xl">
                                    {/* Check In / Check Out */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">Check In</p>
                                            <p className="text-blue-600 font-semibold">{booking.checkIn}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">Check Out</p>
                                            <p className="text-blue-600 font-semibold">{booking.checkOut}</p>
                                        </div>
                                    </div>

                                    {/* Guest Name */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Guest Name</p>
                                        <p className="text-blue-600 font-semibold">{booking.guestName}</p>
                                    </div>

                                    {/* Call Number */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Call Number</p>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{booking.callNumber}</p>
                                            <Eye className="h-4 w-4 text-gray-600" />
                                        </div>
                                    </div>

                                    {/* Booking Number */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">Booking Number</p>
                                        <p className="text-blue-600 font-bold text-lg">{booking.bookingNumber}</p>
                                    </div>

                                    {/* Status Selection */}
                                    <div className="mt-6">
                                        <div className="bg-green-500 text-white p-3 rounded-t-lg">
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="w-full bg-green-500 text-white font-bold text-lg border-none outline-none"
                                            >
                                                <option value="">Select ✓</option>
                                                <option value="confirm">Confirm</option>
                                                <option value="fails">Fails to arrive</option>
                                                <option value="noshow">No Show</option>
                                                <option value="cancel">Cancel</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-3 gap-0">
                                            <button className="bg-gray-200 hover:bg-gray-300 p-3 font-semibold border border-gray-300">
                                                Fails to arrive
                                            </button>
                                            <button className="bg-gray-200 hover:bg-gray-300 p-3 font-semibold border border-gray-300">
                                                No Show
                                            </button>
                                            <button className="bg-gray-200 hover:bg-gray-300 p-3 font-semibold border border-gray-300">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* View All Links */}
            <div className="pt-6 space-y-4">
                <div>
                    <a href="#" className="text-blue-600 font-bold text-lg underline hover:text-blue-800">
                        View All Time No Show Booking Summary &gt;&gt;
                    </a>
                    <p className="text-sm text-blue-600">
                        Guest History (The "Repeat" No-Show)
                    </p>
                </div>
                <div>
                    <a href="#" className="text-blue-600 font-bold text-lg underline hover:text-blue-800">
                        View All Time Previous Booking &gt;&gt;
                    </a>
                    <p className="text-sm text-blue-600">
                        historical data for a specific guest or the reconciliation of past reservations.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ConfirmNoShow
