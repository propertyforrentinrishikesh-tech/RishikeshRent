"use client"
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Star, Eye, Trash2, Loader2, Calendar, User, Briefcase, MapPin, Edit, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const ReviewsGuestExperience = ({ propertyData }) => {
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
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
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false) // Data fetching loading
    const [submitting, setSubmitting] = useState(false) // Form submission loading

    // Image Upload State
    const [reviewImages, setReviewImages] = useState([])
    const [uploadingImages, setUploadingImages] = useState(false)

    // Delete State
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [reviewToDelete, setReviewToDelete] = useState(null)

    // Edit State
    const [editingReview, setEditingReview] = useState(null)

    // View State
    const [viewingReview, setViewingReview] = useState(null)
    const [showViewDialog, setShowViewDialog] = useState(false)

    useEffect(() => {
        if (propertyData?._id) {
            fetchReviews()
        }
    }, [propertyData])

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/cloudinary', {
            method: 'POST',
            body: formData
        })

        const data = await res.json()

        if (res.ok && data.url) {
            return { url: data.url, key: data.key || '' }
        } else {
            throw new Error(data.error || 'Upload failed')
        }
    }

    const handleImageAdd = async (files) => {
        if (!files || files.length === 0) return

        setUploadingImages(true)
        try {
            const uploadedImages = []

            for (const file of Array.from(files)) {
                try {
                    const imageData = await uploadImageToCloudinary(file)
                    uploadedImages.push(imageData)
                } catch (error) {
                    console.error('Upload error:', error)
                    toast.error(`Failed to upload ${file.name}`)
                }
            }

            if (uploadedImages.length > 0) {
                setReviewImages(prev => [...prev, ...uploadedImages])
                toast.success(`${uploadedImages.length} image(s) uploaded`)
            }
        } finally {
            setUploadingImages(false)
        }
    }

    const handleImageDelete = async (imageKey) => {
        try {
            if (imageKey) {
                await fetch('/api/cloudinary', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ publicId: imageKey })
                })
            }
            setReviewImages(prev => prev.filter(img => img.key !== imageKey))
            toast.success('Image removed')
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Failed to remove image')
        }
    }

    const ImagePreviewBox = ({ image, onDelete }) => (
        <div className="relative group w-48 h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <Image
                width={100}
                height={100}
                src={image.url}
                alt="Preview"
                className="w-full h-full object-cover"
            />
            <button
                onClick={() => onDelete(image.key)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                type="button"
            >
                <Trash2 size={12} />
            </button>
        </div>
    )

    const UploadButton = ({ onChange, uploading = false }) => (
        <label className={`w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {uploading ? (
                <Loader2 className="text-purple-500 animate-spin" size={20} />
            ) : (
                <Upload className="text-gray-400 hover:text-purple-500" size={20} />
            )}
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={onChange}
                className="hidden"
                disabled={uploading}
            />
        </label>
    )

    const fetchReviews = async () => {
        setLoading(true)
        try {
            const propertyId = propertyData._id.$oid || propertyData._id
            const response = await fetch(`/api/reviews?propertyId=${propertyId}`)
            const result = await response.json()
            if (result.success) {
                setReviews(result.data || [])
            }
        } catch (error) {
            console.error('Error fetching reviews:', error)
            toast.error('Failed to load reviews')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (review) => {
        setEditingReview(review)
        setValue('guestName', review.guestName)
        setValue('dateOfReview', new Date(review.dateOfReview).toISOString().split('T')[0])
        setValue('travelType', review.travelType)
        setValue('reviewTitle', review.reviewTitle)
        setValue('description', review.description)
        setRating(review.rating)
        setReviewImages(review.images || [])
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const cancelEdit = () => {
        setEditingReview(null)
        reset()
        setRating(0)
        setReviewImages([])
    }

    const openViewDialog = (review) => {
        setViewingReview(review)
        setShowViewDialog(true)
    }

    const onSubmit = async (data) => {
        if (!propertyData?._id) {
            toast.error('Property ID missing')
            return
        }
        if (rating === 0) {
            toast.error('Please select a star rating')
            return
        }

        setSubmitting(true)
        try {
            const propertyId = propertyData._id.$oid || propertyData._id
            const payload = {
                ...data,
                rating,
                propertyId,
                images: reviewImages
            }

            let url = '/api/reviews'
            let method = 'POST'

            if (editingReview) {
                method = 'PUT'
                payload.id = editingReview._id
            }

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (result.success) {
                toast.success(editingReview ? 'Review updated successfully' : 'Review added successfully')
                reset()
                setRating(0)
                setEditingReview(null)
                setReviewImages([])
                fetchReviews()
            } else {
                toast.error(result.message || 'Failed to save review')
            }
        } catch (error) {
            console.error('Error saving review:', error)
            toast.error('Failed to save review')
        } finally {
            setSubmitting(false)
        }
    }

    const openDeleteDialog = (review) => {
        setReviewToDelete(review)
        setShowDeleteDialog(true)
    }

    const confirmDelete = async () => {
        if (!reviewToDelete) return
        try {
            const response = await fetch(`/api/reviews?id=${reviewToDelete._id}`, {
                method: 'DELETE'
            })
            const result = await response.json()
            if (result.success) {
                toast.success('Review deleted successfully')
                setReviews(prev => prev.filter(r => r._id !== reviewToDelete._id))
                setShowDeleteDialog(false)
                setReviewToDelete(null)
            } else {
                toast.error(result.message || 'Failed to delete review')
            }
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Failed to delete review')
        }
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white">Reviews & Guest Experience</h1>
                <p className="text-white font-semibold mt-2">Manage guest reviews and improve your property ranking.</p>
            </div>

            {/* Main Content - Form & List */}
            <div className="lg:col-span-12 space-y-8">
                {/* Create Review Form */}
                <Card className="shadow-md border-0">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User className="h-6 w-6 text-gray-500" />
                            {editingReview ? 'Edit Guest Review' : 'Add New Guest Review'}
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Guest Name */}
                            <div>
                                <Label className="text-gray-700 font-semibold mb-1 block">Guest Name</Label>
                                <Input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    {...register('guestName', { required: 'Guest name is required' })}
                                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-purple-500"
                                />
                                {errors.guestName && <span className="text-red-500 text-xs">{errors.guestName.message}</span>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Date Of Review */}
                                <div>
                                    <Label className="text-gray-700 font-semibold mb-1 block">Date of Review</Label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            {...register('dateOfReview', { required: 'Date is required' })}
                                            className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-purple-500"
                                        />
                                        {/* <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" /> */}
                                    </div>
                                    {errors.dateOfReview && <span className="text-red-500 text-xs">{errors.dateOfReview.message}</span>}
                                </div>

                                {/* Travel Type */}
                                <div>
                                    <Label className="text-gray-700 font-semibold mb-1 block">Travel Type</Label>
                                    <Controller
                                        control={control}
                                        name="travelType"
                                        rules={{ required: 'Travel type is required' }}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full bg-white border-gray-300">
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="soloTraveler">Solo Traveler</SelectItem>
                                                    <SelectItem value="couple">Couple</SelectItem>
                                                    <SelectItem value="family">Family</SelectItem>
                                                    <SelectItem value="business">Business</SelectItem>
                                                    <SelectItem value="group">Group</SelectItem>
                                                    <SelectItem value="friends">Friends</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.travelType && <span className="text-red-500 text-xs">{errors.travelType.message}</span>}
                                </div>
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
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${star <= (hoveredRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-200 text-gray-200'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Click to rate</p>
                            </div>

                            {/* Review Title Line */}
                            <div>
                                <Label className="text-gray-700 font-semibold mb-1 block">Review Title</Label>
                                <Input
                                    type="text"
                                    placeholder="e.g. Amazing stay, highly recommended!"
                                    {...register('reviewTitle', { required: 'Title is required' })}
                                    className="w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-purple-500"
                                />
                                {errors.reviewTitle && <span className="text-red-500 text-xs">{errors.reviewTitle.message}</span>}
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="text-gray-700 font-semibold mb-1 block">Description</Label>
                                <textarea
                                    placeholder="Share the details of the guest's experience..."
                                    {...register('description', { required: 'Description is required' })}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                                />
                                {errors.description && <span className="text-red-500 text-xs">{errors.description.message}</span>}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <Label className="text-gray-700 font-semibold mb-2 block">Guest Photos</Label>
                                <div className="flex flex-wrap gap-3">
                                    {reviewImages.map((img, idx) => (
                                        <ImagePreviewBox
                                            key={img.key || idx}
                                            image={img}
                                            onDelete={(key) => handleImageDelete(key)}
                                        />
                                    ))}
                                    <UploadButton
                                        onChange={(e) => handleImageAdd(e.target.files)}
                                        uploading={uploadingImages}
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-lg rounded-lg shadow-lg transition-all transform hover:-translate-y-1"
                                >
                                    {submitting ? <Loader2 className="animate-spin mr-2" /> : (editingReview ? 'Update Review' : 'Save Review')}
                                </Button>
                                {editingReview && (
                                    <Button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-8 py-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-lg rounded-lg shadow-sm"
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Review Log Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Reviews Log</h2>
                        <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {reviews.length} Total
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
                            <p className="text-gray-500 mt-2">Loading reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                            <p className="text-gray-500 text-lg">No reviews yet. Be the first to add one!</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-100 border-b border-gray-200">
                                        <th className="p-4 font-semibold text-gray-700">S.No.</th>
                                        <th className="p-4 font-semibold text-gray-700">Guest Name</th>
                                        <th className="p-4 font-semibold text-gray-700">Rating</th>
                                        <th className="p-4 font-semibold text-gray-700 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review, index) => (
                                        <tr key={review._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-sm font-medium text-gray-600">{index + 1}</td>
                                            <td className="p-4">
                                                <div className="font-semibold text-gray-900">{review.guestName}</div>
                                                <div className="text-xs text-gray-500">{new Date(review.dateOfReview).toLocaleDateString()}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                    ))}
                                                    <span className="ml-2 text-sm text-gray-600 font-medium">{review.rating}.0</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => openViewDialog(review)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                                    >
                                                        <Eye size={16} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleEdit(review)}
                                                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs"
                                                    >
                                                        <Edit size={16} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => openDeleteDialog(review)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* View Dialog */}
            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Guest Review Details</DialogTitle>
                    </DialogHeader>
                    {viewingReview && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{viewingReview.guestName}</h3>
                                    <p className="text-sm text-gray-500">{new Date(viewingReview.dateOfReview).toLocaleDateString()}</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
                                        {viewingReview.rating} <Star className="h-5 w-5 fill-current" />
                                    </div>
                                    <span className="text-xs text-gray-500 uppercase">{viewingReview.travelType}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-1">{viewingReview.reviewTitle}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                                    "{viewingReview.description}"
                                </p>
                            </div>
                            {viewingReview.images && viewingReview.images.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Photos</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {viewingReview.images.map((img, idx) => (
                                            <div key={idx} className="relative w-40 h-40 rounded-md overflow-hidden border border-gray-200">
                                                <Image
                                                    src={img.url}
                                                    alt="Review photo"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setShowViewDialog(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Review</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-700">
                            Are you sure you want to delete the review by <strong className="text-gray-900">{reviewToDelete?.guestName}</strong>?
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ReviewsGuestExperience
