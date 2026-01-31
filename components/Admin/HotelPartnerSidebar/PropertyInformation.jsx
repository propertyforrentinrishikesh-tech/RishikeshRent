"use client"
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Building, Mail, Phone, FileText, Upload, Loader2, Save, X, Eye, ShieldCheck, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

const PropertyInformation = ({ propertyData, onDataUpdate }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            officialPropertyName: '',
            officialEmail: '',
            officialContact: '',
            alternativeContact: '',
            propertyPanNumber: '',
            gstNumber: ''
        }
    })

    const [submitting, setSubmitting] = useState(false)
    const [uploadingState, setUploadingState] = useState({})

    // States for document objects { url, key }
    const [propertyPanDocument, setPropertyPanDocument] = useState(null)
    const [gstDocument, setGstDocument] = useState(null)
    const [RegistrationDocument, setRegistrationDocument] = useState(null)
    const [hotelRegistrationDocument, setHotelRegistrationDocument] = useState(null)
    const [otherDocument, setOtherDocument] = useState(null)

    useEffect(() => {
        if (propertyData) {
            setValue('officialPropertyName', propertyData.officialPropertyName || '')
            setValue('officialEmail', propertyData.officialEmail || '')
            setValue('officialContact', propertyData.officialContact || '')
            setValue('alternativeContact', propertyData.alternativeContact || '')
            setValue('propertyPanNumber', propertyData.propertyPanNumber || '')
            setValue('gstNumber', propertyData.gstNumber || '')

            if (propertyData.propertyPanDocument) setPropertyPanDocument(propertyData.propertyPanDocument)
            if (propertyData.gstDocument) setGstDocument(propertyData.gstDocument)
            if (propertyData.RegistrationDocument) setRegistrationDocument(propertyData.RegistrationDocument)
            if (propertyData.hotelRegistrationDocument) setHotelRegistrationDocument(propertyData.hotelRegistrationDocument)
            if (propertyData.otherDocument) setOtherDocument(propertyData.otherDocument)
        }
    }, [propertyData, setValue])

    const uploadFileToCloudinary = async (file) => {
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

    const handleUpload = async (e, setDoc, fieldId) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingState(prev => ({ ...prev, [fieldId]: true }))
        try {
            const docData = await uploadFileToCloudinary(file)
            setDoc(docData)
            toast.success('Document uploaded')
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload document')
        } finally {
            setUploadingState(prev => ({ ...prev, [fieldId]: false }))
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
                propertyPanDocument,
                gstDocument,
                RegistrationDocument,
                hotelRegistrationDocument,
                otherDocument
            }

            const response = await fetch('/api/property-information', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Property information updated successfully')
                if (onDataUpdate) onDataUpdate()
            } else {
                toast.error(result.message || 'Failed to update details')
            }
        } catch (error) {
            console.error('Update error:', error)
            toast.error('Failed to update details')
        } finally {
            setSubmitting(false)
        }
    }

    const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');

    const DocumentUpload = ({ label, docState, setDocState, uploadId }) => (
        <div className="space-y-2">
            <Label className="text-gray-700 font-medium">{label}</Label>
            <div className={`border-2 border-dashed rounded-xl p-4 transition-all bg-gray-50 flex flex-col items-center gap-4 ${docState?.url ? 'border-blue-300 bg-blue-50/30' : 'border-gray-300 hover:border-blue-400'}`}>

                {/* Preview Area */}
                <div className="w-full flex justify-center min-h-[100px] items-center">
                    {docState?.url ? (
                        isPdf(docState.url) ? (
                            <div className="flex flex-col items-center">
                                <div className="h-20 w-20 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                                    <FileText className="h-10 w-10 text-red-500" />
                                </div>
                                <a href={docState.url} target="_blank" className="text-xs text-blue-600 hover:underline font-medium">View PDF</a>
                            </div>
                        ) : (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="group relative h-40 w-full max-w-[500px] rounded-lg overflow-hidden cursor-pointer shadow-sm border border-gray-200">
                                        <Image
                                            src={docState.url}
                                            alt="Document Preview"
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                                                <Eye className="h-5 w-5" />
                                            </div>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none">
                                    <DialogTitle className="sr-only">Document Preview</DialogTitle>
                                    <div className="relative w-full h-[80vh] bg-transparent flex items-center justify-center">
                                        <Image
                                            src={docState.url}
                                            alt="Full Document"
                                            fill
                                            className="object-contain"
                                        />
                                        <button className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 pointer-events-none opacity-0">
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-xs">No Upload</span>
                        </div>
                    )}
                </div>

                {/* Button */}
                <div className="w-full">
                    <input
                        type="file"
                        id={uploadId}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleUpload(e, setDocState, uploadId)}
                        disabled={uploadingState[uploadId]}
                    />
                    <label htmlFor={uploadId} className="w-full block">
                        <div className={`w-full py-2 px-4 rounded-lg border text-center text-sm font-medium cursor-pointer transition-colors ${docState?.url ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-blue-600 text-white hover:bg-blue-700 border-transparent'}`}>
                            {uploadingState[uploadId] ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : (docState?.url ? 'Change' : 'Upload')}
                        </div>
                    </label>
                </div>
            </div>
        </div>
    )

    return (
        <div className="w-full mx-auto p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-lime-500 to-lime-700 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Property Details</h1>
                        <p className="text-white font-semibold mt-1 text-md">Official property information and legal documents.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">

                {/* Basic Info Card */}
                <Card className="shadow-lg border-0 ring-1 ring-gray-200">
                    <CardHeader className="bg-gray-50 border-b border-gray-100 flex flex-row items-center gap-3 py-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-800">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label className="text-gray-700 font-medium mb-1.5 block">Official Property Name</Label>
                            <Input
                                placeholder="Registered Name"
                                className="h-11"
                                {...register('officialPropertyName')}
                            />
                        </div>
                        <div>
                            <Label className="text-gray-700 font-medium mb-1.5 block">Official Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="official@example.com"
                                    className="h-11 pl-10"
                                    {...register('officialEmail')}
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-gray-700 font-medium mb-1.5 block">Contact Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="+91 9876543210"
                                    className="h-11 pl-10"
                                    {...register('officialContact')}
                                />
                            </div>
                        </div>
                        <div>
                            <Label className="text-gray-700 font-medium mb-1.5 block">Alternative Contact</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="Other Contact Number"
                                    className="h-11 pl-10"
                                    {...register('alternativeContact')}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Legal & Documents */}
                <Card className="shadow-lg border-0 ring-1 ring-gray-200">
                    <CardHeader className="bg-gray-50 border-b border-gray-100 flex flex-row items-center gap-3 py-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-800">Legal Documents & Registration</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 md:p-8 space-y-8">

                        {/* PAN Section */}
                        <div className="">
                            <div className="md:col-span-8">
                                <Label className="text-gray-700 font-medium mb-1.5 block">Property PAN Number</Label>
                                <Input
                                    placeholder="Permanent Account Number"
                                    className="h-11 uppercase"
                                    {...register('propertyPanNumber')}
                                />
                            </div>
                            <div className="md:col-span-4">
                                <DocumentUpload
                                    label="PAN Document"
                                    docState={propertyPanDocument}
                                    setDocState={setPropertyPanDocument}
                                    uploadId="pan-doc"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-300"></div>

                        {/* GST Section */}
                        <div className="">
                            <div className="md:col-span-8">
                                <Label className="text-gray-700 font-medium mb-1.5 block">GST Number</Label>
                                <Input
                                    placeholder="GSTIN"
                                    className="h-11 uppercase"
                                    {...register('gstNumber')}
                                />
                            </div>
                            <div className="md:col-span-4">
                                <DocumentUpload
                                    label="GST Document"
                                    docState={gstDocument}
                                    setDocState={setGstDocument}
                                    uploadId="gst-doc"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-300"></div>

                        {/* Other Registrations */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <DocumentUpload
                                label="Registration Document"
                                docState={RegistrationDocument}
                                setDocState={setRegistrationDocument}
                                uploadId="Registration-doc"
                            />
                            <DocumentUpload
                                label="Hotel Registration Document"
                                docState={hotelRegistrationDocument}
                                setDocState={setHotelRegistrationDocument}
                                uploadId="hotel-reg-doc"
                            />
                            <DocumentUpload
                                label="Any Other Legal Document"
                                docState={otherDocument}
                                setDocState={setOtherDocument}
                                uploadId="other-doc"
                            />
                        </div>

                    </CardContent>
                </Card>

                {/* Bottom Save Button (Mobile/Extra) */}
                <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={submitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-xl shadow-lg text-lg flex items-center justify-center gap-2"
                >
                    {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                    Save Changes
                </Button>

            </form>
        </div>
    )
}

export default PropertyInformation
