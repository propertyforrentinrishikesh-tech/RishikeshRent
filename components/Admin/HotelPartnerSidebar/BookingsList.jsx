"use client"
import React, { useState } from 'react'
import { Eye, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const BookingsList = () => {
    const [expandedBooking, setExpandedBooking] = useState(null)

    const bookings = [
        {
            id: 1,
            sno: '01',
            name: 'Reservation details',
            noOfDays: '1 night',
            bookingPrice: 'Rs. 15000',
            checkIn: 'Sat 4 Apr 2020',
            checkOut: 'Sun 5 Apr 2020',
            lengthOfStay: '1 night',
            totalGuests: 18,
            totalUnits: 9,
            totalPrice: 'Rs. 15000',
            guestName: 'JESENHAS FORD',
            country: 'Netherlands',
            email: 'ford.3456@2xbookings.com',
            phone: '30 08 Prudential Tower, 19 Occi St bangkok N/A',
            language: 'English UK',
            propertyName: 'Rishikesh Rent.com',
            bookingNumber: '3479541828',
            receivedDate: 'Sat 4 Apr 2020',
            advanceReceived: 'Rs. 5000',
            commissionableAmount: 'Rs. 2000',
            taxAmount: 'Rs. 5000'
        },
        { id: 2, sno: '02', name: 'Name', noOfDays: '2 nights', bookingPrice: 'Rs. 8000' },
        { id: 3, sno: '03', name: 'Name', noOfDays: '1 night', bookingPrice: 'Rs. 6000' },
        { id: 4, sno: '04', name: 'Name', noOfDays: '3 nights', bookingPrice: 'Rs. 12000' },
        { id: 5, sno: '05', name: 'Name', noOfDays: '2 nights', bookingPrice: 'Rs. 4000' }
    ]

    const toggleBooking = (id) => {
        setExpandedBooking(expandedBooking === id ? null : id)
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <h1 className="text-3xl font-bold text-gray-900">Booking List Log</h1>
            <h2 className="text-2xl font-bold text-gray-900">Current / Today Booking</h2>

            {/* Bookings Table */}
            <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 bg-cyan-400 p-3 rounded-lg font-bold text-gray-900">
                    <div className="col-span-1 text-center">Sno.</div>
                    <div className="col-span-4">Name</div>
                    <div className="col-span-3 text-center">No Of Days</div>
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
                            <div className="col-span-1 text-center font-bold">{booking.sno}</div>
                            <div className="col-span-4 font-semibold">{booking.name}</div>
                            <div className="col-span-3 text-center">{booking.noOfDays}</div>
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
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Check-in</p>
                                            <p className="font-bold text-gray-900">{booking.checkIn}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Check-out</p>
                                            <p className="font-bold text-gray-900">{booking.checkOut}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Length of stay:</p>
                                            <p className="font-semibold text-gray-900">{booking.lengthOfStay}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Total guests:</p>
                                            <p className="font-semibold text-gray-900">{booking.totalGuests}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Total units:</p>
                                            <p className="font-semibold text-gray-900">{booking.totalUnits}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Total price:</p>
                                            <p className="font-bold text-gray-900">{booking.totalPrice}</p>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Guest name</p>
                                            <p className="font-bold text-gray-900">{booking.guestName}</p>
                                            <p className="text-xs text-gray-600 flex items-center gap-1">
                                                <span className="text-red-600">🇳🇱</span> {booking.country}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-blue-600 text-sm">{booking.email}</p>
                                            <p className="text-blue-600 text-sm cursor-pointer hover:underline">
                                                ⓘ Show phone number
                                            </p>
                                            <p className="text-xs text-gray-700">{booking.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Preferred language</p>
                                            <p className="font-semibold text-gray-900">{booking.language}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Property name</p>
                                            <p className="font-semibold text-gray-900">{booking.propertyName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Booking number:</p>
                                            <p className="font-bold text-lg text-red-600 border-2 border-red-600 inline-block px-2 py-1">
                                                {booking.bookingNumber}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Received</p>
                                            <p className="font-semibold text-gray-900">{booking.receivedDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Notepad (Internal only)</p>
                                            <p className="text-sm text-gray-600">Add your note here</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Advance Received</p>
                                                <p className="font-bold text-gray-900">{booking.advanceReceived}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Commissionable amount:</p>
                                                <p className="font-bold text-gray-900">{booking.commissionableAmount}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Tax Amount ( CGST + SGST )</p>
                                            <p className="font-bold text-gray-900">{booking.taxAmount}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex gap-3 justify-end">
                                    <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
                                        Select ✓
                                    </Button>
                                    <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">
                                        Confirm
                                    </Button>
                                    <Button className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded">
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* View All Link */}
            <div className="pt-6">
                <a href="#" className="text-blue-600 font-bold text-lg underline hover:text-blue-800">
                    View All Time Previous Booking &gt;&gt;
                </a>
                <p className="text-sm text-blue-600">
                    historical data for a specific guest or the reconciliation of past reservations.
                </p>
            </div>
        </div>
    )
}

export default BookingsList
