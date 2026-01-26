"use client"
import React, { useState } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([
        {
            id: 1,
            rating: 5,
            status: 'Pending',
            text: 'We had a really magnificent staying place and we got a very good service from the hotel staff. The rooms were very clean and the food was also very good. I would definitely recommend this hotel to everyone. A pleasant experience it was and I would love to visit again.',
            response: 'Awesome Delhi'
        },
        {
            id: 2,
            rating: 5,
            status: 'Approved',
            text: 'We had a really magnificent staying place and we got a very good service from the hotel staff. The rooms were very clean and the food was also very good. I would definitely recommend this hotel to everyone. A pleasant experience it was and I would love to visit again.',
            response: 'Awesome Delhi'
        },
        {
            id: 3,
            rating: 5,
            status: 'Pending',
            text: 'We had a really magnificent staying place and we got a very good service from the hotel staff. The rooms were very clean and the food was also very good. I would definitely recommend this hotel to everyone. A pleasant experience it was and I would love to visit again.',
            response: 'Awesome Delhi'
        },
        {
            id: 4,
            rating: 5,
            status: 'Rejected',
            text: 'We had a really magnificent staying place and we got a very good service from the hotel staff. The rooms were very clean and the food was also very good. I would definitely recommend this hotel to everyone. A pleasant experience it was and I would love to visit again.',
            response: 'Awesome Delhi'
        }
    ])

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-400'
            case 'Approved':
                return 'bg-green-500'
            case 'Rejected':
                return 'bg-red-500'
            default:
                return 'bg-gray-400'
        }
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-gradient-to-br from-gray-100 to-gray-200">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <Card key={review.id} className="shadow-lg relative overflow-hidden">
                        {/* Delete Button */}
                        <button className="absolute top-3 left-3 z-10 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors">
                            <Trash2 className="h-5 w-5 text-white" />
                        </button>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 z-10">
                            <div className={`${getStatusColor(review.status)} px-4 py-1 rounded-full flex items-center gap-2`}>
                                <span className="text-white font-bold text-sm">Status</span>
                                <div className="bg-yellow-300 px-3 py-0.5 rounded-full">
                                    <span className="text-gray-900 font-bold text-xs">{review.status}</span>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-6 pt-16">
                            {/* Star Rating */}
                            <div className="flex gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-6 w-6 ${star <= review.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'fill-gray-300 text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Review Text */}
                            <div className="bg-white p-4 rounded-lg shadow-inner mb-4 min-h-[120px]">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {review.text}
                                </p>
                            </div>

                            {/* Response */}
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">
                                    <span className="text-gray-600">-</span> {review.response}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination or Load More */}
            <div className="flex justify-center pt-6">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
                    Load More Reviews
                </Button>
            </div>
        </div>
    )
}

export default ReviewManagement
