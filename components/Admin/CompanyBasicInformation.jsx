'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Plus, Trash2, Upload } from 'lucide-react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

const logoFields = [
  { key: 'mainLogo', label: 'Main Logo' },
  { key: 'footerLogo', label: 'Footer Logo' },
  { key: 'mobileUiLogo', label: 'Mobile UI Logo' },
]

const createEmptyFormData = () => ({
  companyName: '',
  companyDomainName: '',
  contactNumbers: [''],
  mainLogo: { url: '', key: '' },
  footerLogo: { url: '', key: '' },
  mobileUiLogo: { url: '', key: '' },
  emails: [''],
  officeAddresses: [''],
  googleAddress: '',
  facebookLink: '',
  instagramLink: '',
  youtubeLink: '',
  googleMapLink: '',
  googleTrackingTag: '',
  titleTagForMainLandingPage: '',
  keywords: [''],
})

const normalizeArray = (value) => {
  if (!Array.isArray(value)) {
    return ['']
  }

  const cleaned = value
    .map((item) => String(item ?? '').trim())
    .filter(Boolean)

  return cleaned.length > 0 ? cleaned : ['']
}

const normalizeCompanyInfo = (record) => ({
  companyName: record?.companyName || '',
  companyDomainName: record?.companyDomainName || '',
  contactNumbers: normalizeArray(record?.contactNumbers),
  mainLogo: record?.mainLogo || { url: '', key: '' },
  footerLogo: record?.footerLogo || { url: '', key: '' },
  mobileUiLogo: record?.mobileUiLogo || { url: '', key: '' },
  emails: normalizeArray(record?.emails),
  officeAddresses: normalizeArray(record?.officeAddresses),
  googleAddress: record?.googleAddress || '',
  facebookLink: record?.facebookLink || '',
  instagramLink: record?.instagramLink || '',
  youtubeLink: record?.youtubeLink || '',
  googleMapLink: record?.googleMapLink || '',
  googleTrackingTag: record?.googleTrackingTag || '',
  titleTagForMainLandingPage: record?.titleTagForMainLandingPage || '',
  keywords: normalizeArray(record?.keywords),
})

const CompanyBasicInformation = () => {
  const [recordId, setRecordId] = useState(null)
  const [formData, setFormData] = useState(createEmptyFormData)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingField, setUploadingField] = useState('')
  const fileInputRefs = useRef({})

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch('/api/company-basic-information')
        const result = await response.json()

        if (response.ok && result?.data) {
          setRecordId(result.data._id || null)
          setFormData(normalizeCompanyInfo(result.data))
        }
      } catch (error) {
        toast.error('Failed to load company basic info')
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyInfo()
  }, [])

  const handleScalarChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const nextValues = [...prev[field]]
      nextValues[index] = field === 'contactNumbers' ? value.replace(/\D/g, '').slice(0, 10) : value
      return { ...prev, [field]: nextValues }
    })
  }

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeArrayItem = (field, index) => {
    setFormData((prev) => {
      const nextValues = prev[field].filter((_, itemIndex) => itemIndex !== index)
      return { ...prev, [field]: nextValues.length > 0 ? nextValues : [''] }
    })
  }

  const handleImageChange = async (field, event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingField(field)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const response = await fetch('/api/cloudinary', {
        method: 'POST',
        body: formDataUpload,
      })

      const result = await response.json()

      if (response.ok && result?.url) {
        setFormData((prev) => ({
          ...prev,
          [field]: {
            url: result.url,
            key: result.key || '',
          },
        }))
        toast.success('Image uploaded!')
      } else {
        toast.error(`Cloudinary upload failed: ${result?.error || 'Unknown error'}`)
      }
    } catch (error) {
      toast.error(`Cloudinary upload error: ${error.message}`)
    } finally {
      setUploadingField('')
      event.target.value = ''
    }
  }

  const handleRemoveImage = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { url: '', key: '' },
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.companyName.trim()) {
      toast.error('Company name is required')
      return
    }

    const invalidContactNumber = formData.contactNumbers.find((number) => String(number).trim() && String(number).trim().length !== 10)
    if (invalidContactNumber !== undefined) {
      toast.error('Each contact number must be exactly 10 digits')
      return
    }
    setSubmitting(true)

    try {
      const payload = {
        ...formData,
        contactNumbers: normalizeArray(formData.contactNumbers),
        emails: normalizeArray(formData.emails),
        officeAddresses: normalizeArray(formData.officeAddresses),
        keywords: normalizeArray(formData.keywords),
      }

      const response = await fetch('/api/company-basic-information', {
        method: recordId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          ...(recordId ? { id: recordId } : {}),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || result?.message || 'Failed to save company info')
      }

      const savedRecord = result?.data || result?.companyBasicInfo || result
      setRecordId(savedRecord?._id || recordId)
      setFormData(normalizeCompanyInfo(savedRecord))
      toast.success(`Company basic info ${recordId ? 'updated' : 'created'} successfully`)
    } catch (error) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const renderListField = ({ field, label, placeholder, type = 'text', prefix = '', isTextarea = false }) => (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 ">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-sm font-semibold text-slate-800">{label}</Label>
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => addArrayItem(field)}>
          <Plus className="h-4 w-4" />
          Add More
        </Button>
      </div>
      <div className="space-y-3">
        {formData[field].map((value, index) => (
          <div key={`${field}-${index}`} className="flex gap-2">
            {prefix ? (
              <div className="flex h-10 min-w-14 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700">
                {prefix}
              </div>
            ) : null}
            {isTextarea ? (
              <Textarea
                value={value}
                onChange={(event) => handleArrayChange(field, index, event.target.value)}
                placeholder={placeholder}
                rows={3}
                className="min-h-24"
              />
            ) : (
              <Input
                type={type}
                value={value}
                onChange={(event) => handleArrayChange(field, index, event.target.value)}
                placeholder={placeholder}
              />
            )}
            {formData[field].length > 1 ? (
              <Button
                type="button"
                variant="outline"
                className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => removeArrayItem(field, index)}
              >
                Remove
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )

  return (
       <div className="mx-auto w-[80%] max-w-7xl py-8">
      <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-slate-800">Company Name</Label>
            <Input name="companyName" value={formData.companyName} onChange={handleScalarChange} placeholder="Type name" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-slate-800">Company Domain Name</Label>
            <Input name="companyDomainName" value={formData.companyDomainName} onChange={handleScalarChange} placeholder="Type domain name" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-sm font-semibold text-slate-800">Contact Numbers</Label>
              <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => addArrayItem('contactNumbers')}>
                <Plus className="h-4 w-4" />
                Add More
              </Button>
            </div>
            <div className="space-y-3">
              {formData.contactNumbers.map((value, index) => (
                <div key={`contact-${index}`} className="flex gap-2">
                  <div className="flex h-10 min-w-14 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700">
                    +91
                  </div>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={value}
                    onChange={(event) => handleArrayChange('contactNumbers', index, event.target.value)}
                    placeholder="Type number"
                  />
                  {formData.contactNumbers.length > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => removeArrayItem('contactNumbers', index)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 grid gap-4 md:grid-cols-3">
            {logoFields.map((field) => (
              <div key={field.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Label className="mb-3 block text-sm font-semibold text-slate-800">{field.label}</Label>
                <input
                  ref={(node) => {
                    fileInputRefs.current[field.key] = node
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => handleImageChange(field.key, event)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="mb-3 w-full gap-2 border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white"
                  onClick={() => fileInputRefs.current[field.key]?.click()}
                  disabled={uploadingField === field.key}
                >
                  <Upload className="h-4 w-4" />
                  {uploadingField === field.key ? 'Uploading...' : 'Browse Image'}
                </Button>
                {formData[field.key]?.url ? (
                  <div className="relative h-36 overflow-hidden rounded-xl border border-slate-300 bg-white">
                    <Image
                      src={formData[field.key].url}
                      alt={`${field.label} preview`}
                      fill
                      className="object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(field.key)}
                      className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-red-600 shadow hover:bg-red-50"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-500">
                    No image selected
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2 md:col-span-2">
            {renderListField({ field: 'emails', label: 'Email Address', placeholder: '@email address', type: 'email' })}
          </div>

          <div className="space-y-2 md:col-span-2">
            {renderListField({ field: 'officeAddresses', label: 'Office Address', placeholder: 'Main address', isTextarea: true })}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-slate-800">Google Address</Label>
            <Textarea name="googleAddress" value={formData.googleAddress} onChange={handleScalarChange} placeholder="Map code" rows={3} />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-800">Facebook Link</Label>
            <Input name="facebookLink" value={formData.facebookLink} onChange={handleScalarChange} placeholder="URL code" type="url" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-800">Instagram Link</Label>
            <Input name="instagramLink" value={formData.instagramLink} onChange={handleScalarChange} placeholder="URL code" type="url" required />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-800">Youtube Link</Label>
            <Input name="youtubeLink" value={formData.youtubeLink} onChange={handleScalarChange} placeholder="URL code" type="url" required />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-slate-800">Google Map</Label>
            <Input name="googleMapLink" value={formData.googleMapLink} onChange={handleScalarChange} placeholder="URL code" type="url" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-slate-800">Google Tracking Tag</Label>
            <Textarea
              name="googleTrackingTag"
              value={formData.googleTrackingTag}
              onChange={handleScalarChange}
              placeholder="Paste the Google tag script here"
              rows={6}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="text-sm font-semibold text-slate-800">Title Tag For Main Landing Page</Label>
            <Input
              name="titleTagForMainLandingPage"
              value={formData.titleTagForMainLandingPage}
              onChange={handleScalarChange}
              placeholder="Title line"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            {renderListField({ field: 'keywords', label: 'Key Words', placeholder: 'Type key words' })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit" className="min-w-48 bg-orange-500 text-white hover:bg-orange-600" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Info'}
          </Button>
          {loading ? <span className="self-center text-sm text-slate-500">Loading existing info...</span> : null}
        </div>
      </form>
    </div>
  )
}

export default CompanyBasicInformation
