"use client"
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, User, Mail, Phone, CreditCard, Upload, Loader2, Save, BadgeCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const PropertyLocation = ({ propertyData, onDataUpdate }) => {
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            apartmentOrFloor: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            pinCode: '',
            googleLocationCode: '',
            googleBusinessProfileCode: '',
            ownerName: '',
            ownerEmail: '',
            ownerContact: '',
            propertyPanNumber: '',
            aadhaarNumber: ''
        }
    })

    const [submitting, setSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [profileImage, setProfileImage] = useState(null)

    useEffect(() => {
        if (propertyData) {
            setValue('apartmentOrFloor', propertyData.apartmentOrFloor || '')
            setValue('addressLine1', propertyData.addressLine1 || '')
            setValue('addressLine2', propertyData.addressLine2 || '')
            setValue('city', propertyData.city || '')
            setValue('pinCode', propertyData.pinCode || '')
            setValue('googleLocationCode', propertyData.googleLocationCode || '')
            setValue('googleBusinessProfileCode', propertyData.googleBusinessProfileCode || '')
            setValue('ownerName', propertyData.ownerName || '')
            setValue('ownerEmail', propertyData.ownerEmail || '')
            setValue('ownerContact', propertyData.ownerContact || '')
            setValue('propertyPanNumber', propertyData.propertyPanNumber || '')
            setValue('aadhaarNumber', propertyData.aadhaarNumber || '')
            if (propertyData.profilePhoto) {
                setProfileImage(propertyData.profilePhoto)
            }
        }
    }, [propertyData, setValue])

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

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const imageData = await uploadImageToCloudinary(file)
            setProfileImage(imageData)
            toast.success('Profile photo uploaded')
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload photo')
        } finally {
            setUploading(false)
        }
    }

    const onSubmit = async (data) => {
        if (!propertyData?._id) {
            toast.error('Property ID not found')
            return
        }

        setSubmitting(true)
        try {
            const payload = {
                ...data,
                propertyId: propertyData._id.$oid || propertyData._id,
                profilePhoto: profileImage
            }

            const response = await fetch('/api/property-location', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Information updated successfully')
                if (onDataUpdate) {
                    onDataUpdate()
                }
            } else {
                toast.error(result.message || 'Failed to update information')
            }
        } catch (error) {
            console.error('Update error:', error)
            toast.error('Failed to update information')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 rounded-lg shadow-lg flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                    <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Location & Contact Info</h1>
                    <p className="text-white font-semibold">Manage your property location and owner details.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Property Location Section */}
                <Card className="shadow-lg border-t-4 border-blue-500">
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            <h2 className="text-xl font-bold text-gray-800">Property Location</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Apartment Number */}
                            <div className="md:col-span-2">
                                <Label className="text-gray-700 font-semibold mb-1 block">Apartment / Floor Number</Label>
                                <Input
                                    {...register('apartmentOrFloor')}
                                    placeholder="e.g. Flat 101, 1st Floor"
                                    className="w-full"
                                />
                            </div>

                            {/* Address Line 1 */}
                            <div className="md:col-span-2">
                                <Label className="text-gray-700 font-semibold mb-1 block">Address Line 1 <span className="text-red-500">*</span></Label>
                                <Input
                                    {...register('addressLine1', { required: 'Address is required' })}
                                    placeholder="House No, Street, Landmark"
                                    className="w-full"
                                />
                                {errors.addressLine1 && <span className="text-red-500 text-xs">{errors.addressLine1.message}</span>}
                            </div>

                            {/* Address Line 2 */}
                            <div className="md:col-span-2">
                                <Label className="text-gray-700 font-semibold mb-1 block">Address Line 2</Label>
                                <Input
                                    {...register('addressLine2')}
                                    placeholder="Area, Locality"
                                    className="w-full"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <Label className="text-gray-700 font-semibold mb-1 block">City <span className="text-red-500">*</span></Label>
                                <Input
                                    {...register('city', { required: 'City is required' })}
                                    placeholder="City"
                                    className="w-full"
                                />
                                {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
                            </div>

                            {/* Pin Code */}
                            <div>
                                <Label className="text-gray-700 font-semibold mb-1 block">Pin Code <span className="text-red-500">*</span></Label>
                                <Input
                                    {...register('pinCode', { required: 'Pin Code is required' })}
                                    placeholder="249201"
                                    className="w-full"
                                />
                                {errors.pinCode && <span className="text-red-500 text-xs">{errors.pinCode.message}</span>}
                            </div>

                            {/* Google Location Code */}
                            <div className="md:col-span-2">
                                <Label className="text-gray-700 font-semibold mb-1 block">Google Map URL / Location Code</Label>
                                <Input
                                    {...register('googleLocationCode')}
                                    placeholder="https://goo.gl/maps/..."
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">Paste your Google Maps share link here.</p>
                            </div>

                            {/* Google Business Profile Code */}
                            <div className="md:col-span-2">
                                <Label className="text-gray-700 font-semibold mb-1 block">Google Business Profile Code</Label>
                                <Input
                                    {...register('googleBusinessProfileCode')}
                                    placeholder="Google Business ID"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Information Section */}
                <Card className="shadow-lg border-t-4 border-indigo-500">
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <User className="h-5 w-5 text-indigo-500" />
                            <h2 className="text-xl font-bold text-gray-800">Owner Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Left Column - Form Fields */}
                            <div className="md:col-span-2 space-y-5">
                                {/* Owner Name */}
                                <div>
                                    <Label className="text-gray-700 font-semibold mb-1 block">Owner Name <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            {...register('ownerName', { required: 'Owner Name is required' })}
                                            className="pl-10"
                                            placeholder="Full Name as per ID"
                                        />
                                    </div>
                                    {errors.ownerName && <span className="text-red-500 text-xs">{errors.ownerName.message}</span>}
                                </div>

                                {/* Email */}
                                <div>
                                    <Label className="text-gray-700 font-semibold mb-1 block">Email <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            {...register('ownerEmail', { required: 'Email is required' })}
                                            className="pl-10"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    {errors.ownerEmail && <span className="text-red-500 text-xs">{errors.ownerEmail.message}</span>}
                                </div>

                                {/* Contact */}
                                <div>
                                    <Label className="text-gray-700 font-semibold mb-1 block">Contact Number <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            {...register('ownerContact', { required: 'Contact is required' })}
                                            className="pl-10"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                    {errors.ownerContact && <span className="text-red-500 text-xs">{errors.ownerContact.message}</span>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* PAN */}
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-1 block">PAN Number</Label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input
                                                {...register('propertyPanNumber')}
                                                className="pl-10"
                                                placeholder="ABCDE1234F"
                                            />
                                        </div>
                                    </div>

                                    {/* Aadhar */}
                                    <div>
                                        <Label className="text-gray-700 font-semibold mb-1 block">Aadhar Number</Label>
                                        <div className="relative">
                                            <BadgeCheck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input
                                                {...register('aadhaarNumber')}
                                                className="pl-10"
                                                placeholder="1234 5678 9012"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Profile Photo */}
                            <div className="flex flex-col items-center justify-start space-y-4 pt-2">
                                <Label className="text-gray-700 font-semibold">Profile Photo</Label>
                                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md bg-gray-100 flex items-center justify-center group">
                                    {profileImage?.url ? (
                                        <Image
                                            src={profileImage.url}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User className="h-16 w-16 text-gray-400" />
                                    )}

                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        {uploading ? (
                                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                                        ) : (
                                            <Upload className="h-8 w-8 text-white" />
                                        )}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleProfileImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 text-center">Click to upload or change photo</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                {/* <div className="fixed bottom-6 right-6 z-10">
                    <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl flex items-center gap-2 transform transition-transform hover:scale-105"
                    >
                        {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                        Save Changes
                    </Button>
                </div> */}
                {/* Inline Submit Button for Mobile / Clarity */}
                <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg rounded-lg shadow-lg"
                >
                    {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Update Information'}
                </Button>
            </form>
        </div>
    )
}

export default PropertyLocation
