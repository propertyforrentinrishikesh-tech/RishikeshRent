"use client"
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { CreditCard, Building2, User, MapPin, Upload, FileText, Loader2, Save, Send, ShieldCheck, Wallet, Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'

const BankInformation = ({ propertyData, onDataUpdate }) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            accountNumber: '',
            bankName: '',
            accountHolderName: '',
            ifscCode: '',
            bankAddress: '',

            secondaryAccountNumber: '',
            secondaryBankName: '',
            secondaryAccountHolderName: '',
            secondaryIfscCode: '',
            secondaryBankAddress: '',

            gstNumber: ''
        }
    })

    const [submitting, setSubmitting] = useState(false)
    const [uploadingState, setUploadingState] = useState({})

    const [cancelledCheque, setCancelledCheque] = useState(null)
    const [secondaryCancelledCheque, setSecondaryCancelledCheque] = useState(null)
    const [gstDocument, setGstDocument] = useState(null)

    useEffect(() => {
        if (propertyData) {
            // Primary
            setValue('accountNumber', propertyData.accountNumber || '')
            setValue('bankName', propertyData.bankName || '')
            setValue('accountHolderName', propertyData.accountHolderName || '')
            setValue('ifscCode', propertyData.ifscCode || '')
            setValue('bankAddress', propertyData.bankAddress || '')

            // Secondary
            setValue('secondaryAccountNumber', propertyData.secondaryAccountNumber || '')
            setValue('secondaryBankName', propertyData.secondaryBankName || '')
            setValue('secondaryAccountHolderName', propertyData.secondaryAccountHolderName || '')
            setValue('secondaryIfscCode', propertyData.secondaryIfscCode || '')
            setValue('secondaryBankAddress', propertyData.secondaryBankAddress || '')

            setValue('gstNumber', propertyData.gstNumber || '')

            if (propertyData.cancelledCheque) setCancelledCheque(propertyData.cancelledCheque)
            if (propertyData.secondaryCancelledCheque) setSecondaryCancelledCheque(propertyData.secondaryCancelledCheque)
            if (propertyData.gstDocument) setGstDocument(propertyData.gstDocument)
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

        // validation: create a check to prevent same account number
        if (data.accountNumber && data.secondaryAccountNumber && data.accountNumber === data.secondaryAccountNumber) {
            toast.error('Primary and Secondary Account Numbers cannot be the same.')
            return
        }

        setSubmitting(true)
        try {
            const payload = {
                ...data,
                propertyId: propertyData._id.$oid || propertyData._id,
                cancelledCheque,
                secondaryCancelledCheque,
                gstDocument
            }

            const response = await fetch('/api/bank-information', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Bank details updated successfully')
                if(onDataUpdate) onDataUpdate()
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

    const BankSection = ({ title, prefix, docState, setDocState, uploadId, icon: Icon }) => {
        // Helper to ensure correct camelCase keys
        const getField = (suffix) => {
            if (prefix) return `${prefix}${suffix}`;
            return suffix.charAt(0).toLowerCase() + suffix.slice(1);
        };

        const isPdf = (url) => url?.toLowerCase().endsWith('.pdf');

        return (
            <Card className="shadow-lg border-0 ring-1 ring-gray-200 overflow-hidden">
                <CardHeader className="bg-gray-50 border-b border-gray-100 flex flex-row items-center gap-3 py-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800">{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Account Number */}
                        <div className="col-span-2 md:col-span-1">
                            <Label className="text-gray-700 font-medium mb-1.5 block">Account Number</Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all"
                                    placeholder="Enter Account Number"
                                    type="number"
                                    {...register(getField('AccountNumber'))}
                                />
                            </div>
                        </div>

                        {/* Holder Name */}
                        <div className="col-span-2 md:col-span-1">
                            <Label className="text-gray-700 font-medium mb-1.5 block">A/C Holder Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all"
                                    placeholder="Name as per Bank"
                                    {...register(getField('AccountHolderName'))}
                                />
                            </div>
                        </div>

                        {/* Bank Name */}
                        <div className="col-span-2 md:col-span-1">
                            <Label className="text-gray-700 font-medium mb-1.5 block">Bank Name</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all"
                                    placeholder="e.g. State Bank of India"
                                    {...register(getField('BankName'))}
                                />
                            </div>
                        </div>

                        {/* IFSC Code */}
                        <div className="col-span-2 md:col-span-1">
                            <Label className="text-gray-700 font-medium mb-1.5 block">IFSC Code</Label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 uppercase rounded-lg transition-all"
                                    placeholder="e.g. SBIN0001234"
                                    {...register(getField('IfscCode'))}
                                />
                            </div>
                        </div>

                        {/* Bank Address */}
                        <div className="col-span-2">
                            <Label className="text-gray-700 font-medium mb-1.5 block">Bank Address</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    className="pl-10 h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all"
                                    placeholder="Bank Branch Address"
                                    {...register(getField('BankAddress'))}
                                />
                            </div>
                        </div>

                        {/* Upload Section */}
                        <div className="col-span-2">
                            <Label className="text-gray-700 font-medium mb-2 block">Cancelled Cheque / Passbook</Label>
                            <div className={`border-2 border-dashed rounded-xl p-6 transition-all bg-gray-50 flex flex-col md:flex-row items-center gap-6 ${docState?.url ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-300 hover:border-indigo-400'}`}>

                                {/* Preview Section */}
                                <div className="flex-1 flex items-center gap-4 w-full">
                                    {docState?.url ? (
                                        isPdf(docState.url) ? (
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="h-32 w-32 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <FileText className="h-12 w-12 text-red-500" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-semibold text-gray-900 truncate">Document Uploaded (PDF)</p>
                                                    <a href={docState.url} target="_blank" className="text-sm text-indigo-600 hover:underline">View PDF</a>
                                                </div>
                                            </div>
                                        ) : (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="group relative h-32 w-48 rounded-lg overflow-hidden cursor-pointer shadow-md border border-gray-200">
                                                        <Image
                                                            src={docState.url}
                                                            alt="Cheque Preview"
                                                            fill
                                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                                                                <Eye className="h-6 w-6" />
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
                                        <div className="flex items-center gap-4 text-gray-500">
                                            <div className="p-4 bg-gray-100 rounded-full">
                                                <Upload className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">No document uploaded</p>
                                                <p className="text-xs">Upload JPG, PNG  (Max 5MB)</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button Helper */}
                                <div className="flex-shrink-0">
                                    <input
                                        type="file"
                                        id={uploadId}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleUpload(e, setDocState, uploadId)}
                                        disabled={uploadingState[uploadId]}
                                    />
                                    <label htmlFor={uploadId}>
                                        <Button
                                            type="button"
                                            asChild
                                            disabled={uploadingState[uploadId]}
                                            variant={docState?.url ? "secondary" : "default"}
                                            className={docState?.url ? "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100" : "bg-indigo-600 hover:bg-indigo-700"}
                                        >
                                            <span className="cursor-pointer min-w-[120px] flex justify-center">
                                                {uploadingState[uploadId] ? <Loader2 className="h-4 w-4 animate-spin" /> : (docState?.url ? 'Change File' : 'Upload File')}
                                            </span>
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="w-full mx-auto p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Main Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                        <Wallet className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Financial Details</h1>
                        <p className="text-indigo-100 mt-1 text-lg">Manage your bank accounts & tax information securely.</p>
                    </div>
                </div>

            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto">
                <BankSection
                    title="Primary Bank Details"
                    prefix=""
                    docState={cancelledCheque}
                    setDocState={setCancelledCheque}
                    uploadId="primary-cheque"
                    icon={Building2}
                />

                <BankSection
                    title="Secondary Bank Details (Optional)"
                    prefix="secondary"
                    docState={secondaryCancelledCheque}
                    setDocState={setSecondaryCancelledCheque}
                    uploadId="secondary-cheque"
                    icon={Building2}
                />
                <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={submitting}
                    className="bg-green-600 text-white hover:bg-green-700 font-bold py-6 px-8 rounded-xl shadow-lg text-lg flex items-center gap-2 transition-transform hover:scale-105 w-full"
                >
                    {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                    Save Changes
                </Button>
            </form>
        </div>
    )
}

export default BankInformation
