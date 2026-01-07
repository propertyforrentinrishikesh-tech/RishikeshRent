"use client"
import React, { useState } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date())

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        return { firstDay, daysInMonth }
    }

    const { firstDay, daysInMonth } = getDaysInMonth(currentDate)

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    const days = []
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear()

        days.push(
            <div
                key={day}
                className={`p-2 text-center border rounded cursor-pointer hover:bg-blue-50 transition-colors ${isToday ? 'bg-blue-500 text-white font-bold' : 'bg-white'
                    }`}
            >
                {day}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                    <p className="text-sm text-gray-600">Manage rates, availability, and restrictions for dates</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={previousMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={nextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center font-semibold text-sm text-gray-600 p-2">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {days}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                            <CardDescription>Manage your property availability</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Update Rates
                            </Button>
                            <Button variant="outline" className="w-full">
                                Set Availability
                            </Button>
                            <Button variant="outline" className="w-full">
                                Add Restrictions
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Today's Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Available Rooms:</span>
                                <span className="font-semibold">8/10</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Bookings:</span>
                                <span className="font-semibold">2</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Revenue:</span>
                                <span className="font-semibold text-green-600">₹5,000</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Upcoming Bookings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Upcoming Bookings</CardTitle>
                    <CardDescription>Next 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3].map((booking) => (
                            <div key={booking} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div>
                                    <p className="font-semibold">Room {booking}</p>
                                    <p className="text-sm text-gray-600">Check-in: Jan {7 + booking}, 2026</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-blue-600">₹2,500/night</p>
                                    <p className="text-sm text-gray-600">2 nights</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Calendar