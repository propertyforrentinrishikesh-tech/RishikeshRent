"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Star, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ReviewsGuestExperience = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            guestName: '',
            dateOfReview: '',
            travelType: '',
            reviewTitle: '',
            description: ''
        }
    })

    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)

    const [reviews, setReviews] = useState([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 }
    ])

    const onSubmit = (data) => {
        console.log('Form Data:', { ...data, rating })
        // Add your review creation logic here
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Reviews and Guest Experience</h1>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Left Sidebar */}
                <div className="col-span-3 space-y-3">
                    <div className="bg-yellow-400 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900">Create Review</h3>
                        <p className="text-xs text-gray-700">Share your property to users profile.</p>
                    </div>
                    <div className="bg-cyan-400 p-4 rounded-lg">
                        <h3 className="font-bold text-gray-900">Review Management</h3>
                        <p className="text-xs text-gray-700">Submitted reviews from guests to improve your ranking.</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-9 space-y-6">
                    {/* Create Review Form */}
                    <Card className="shadow-md">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Review</h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Guest Name */}
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Guest Name"
                                        {...register('guestName', { required: true })}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-full bg-gray-100"
                                    />
                                </div>

                                {/* Date Of Review */}
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Date Of Review"
                                        {...register('dateOfReview')}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-full bg-gray-100"
                                    />
                                </div>

                                {/* Travel Type */}
                                <div className="relative">
                                    <select
                                        {...register('travelType')}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-full bg-gray-100 appearance-none"
                                    >
                                        <option value="">Travel Type</option>
                                        <option value="solo">Solo</option>
                                        <option value="couple">Couple</option>
                                        <option value="family">Family</option>
                                        <option value="business">Business</option>
                                        <option value="group">Group</option>
                                    </select>
                                </div>

                                {/* Star Rating */}
                                <div>
                                    <Label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Star Rating
                                    </Label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoveredRating(star)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`h-8 w-8 ${star <= (hoveredRating || rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'fill-gray-300 text-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Review Title Line */}
                                <div>
                                    <Input
                                        type="text"
                                        placeholder="Review Title Line"
                                        {...register('reviewTitle')}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-full bg-gray-100"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <textarea
                                        placeholder="Description"
                                        {...register('description')}
                                        rows={6}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-3xl bg-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Share Your Image */}
                                <div>
                                    <Button
                                        type="button"
                                        className="w-full py-4 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-full"
                                    >
                                        Share Your Image
                                    </Button>
                                </div>

                                {/* Date Save Button */}
                                <div>
                                    <Button
                                        type="submit"
                                        className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-full transition-colors shadow-lg"
                                    >
                                        Date Save
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Date Log Section */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">Date Log</h2>

                        {/* Review Rows */}
                        <div className="space-y-3">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="flex items-center gap-3 bg-cyan-400 p-4 rounded-lg"
                                >
                                    <div className="flex-1 bg-cyan-400 h-12"></div>
                                    <button className="p-2 bg-white rounded-full hover:bg-gray-100">
                                        <Eye className="h-6 w-6 text-gray-700" />
                                    </button>
                                    <button className="p-2 bg-red-500 rounded-full hover:bg-red-600">
                                        <Trash2 className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewsGuestExperience
