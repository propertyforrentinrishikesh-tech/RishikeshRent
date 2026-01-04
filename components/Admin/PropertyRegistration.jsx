"use client"
import React, { useState, useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'

const PropertyRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
    const [editingRoomIndex, setEditingRoomIndex] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)
    const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false)
    const [customFacilities, setCustomFacilities] = useState([])
    const [newFacilityName, setNewFacilityName] = useState('')
    const [isSavingFacility, setIsSavingFacility] = useState(false)

    const { register, handleSubmit, watch, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            numberOfRooms: 1,
            numberOfFloors: 1,
            propertyConfirmation: '',
            isChainProperty: false,
            starRating: '',
            servesBreakfast: false,
            breakfastIncluded: false,
            parkingAvailable: false,
            allowChildren: false,
            allowPets: 'no',
            rooms: []
        }
    })
    const { fields: roomFields, append: appendRoom, remove: removeRoom, update: updateRoom } = useFieldArray({
        control,
        name: "rooms"
    })

    const [currentRoomData, setCurrentRoomData] = useState({
        roomName: '',
        roomType: '',
        bedTypes: [],
        roomSize: '',
        smokingAllowed: false,
        roomFacilities: [],
        pricePerNight: '',
        numberOfRooms: 1
    })

    const selectedCategory = watch('category')
    const selectedPropertyType = watch('propertyType')
    const customPropertyType = watch('customPropertyType')
    const numberOfRooms = watch('numberOfRooms')
    const numberOfFloors = watch('numberOfFloors')
    const propertyConfirmation = watch('propertyConfirmation')
    const isChainProperty = watch('isChainProperty')
    const starRating = watch('starRating')
    const servesBreakfast = watch('servesBreakfast')
    const breakfastIncluded = watch('breakfastIncluded')
    const parkingAvailable = watch('parkingAvailable')
    const allowPets = watch('allowPets')

    // Fetch custom facilities on component mount
    useEffect(() => {
        const fetchCustomFacilities = async () => {
            try {
                const response = await fetch('/api/customFacilities')
                if (response.ok) {
                    const data = await response.json()
                    setCustomFacilities(data.facilities || [])
                }
            } catch (error) {
                console.error('Error fetching custom facilities:', error)
            }
        }
        fetchCustomFacilities()
    }, [])

    const propertyCategories = [
        {
            id: 'apartment',
            label: 'Apartment',
            description: 'Furnished and self-catering accommodations where guests rent the entire place.',
            icon: '🏢',
            quickStart: true
        },
        {
            id: 'homes',
            label: 'Homes',
            description: 'Properties like apartments, vacation homes, villas, etc.',
            icon: '🏠'
        },
        {
            id: 'hotel',
            label: 'Hotel, B&Bs & More',
            description: 'Properties like hotels, B&Bs, guest houses, hostels, condo hotels, etc.',
            icon: '🏨'
        },
        {
            id: 'alternative',
            label: 'Alternative Places',
            description: 'Properties like boats, campgrounds, luxury tents, etc.',
            icon: '⛺'
        }
    ]

    // Property types organized by category
    const propertyTypesByCategory = {
        apartment: [
            { id: 'apartment', label: 'Apartment', description: 'Furnished and self-catering accommodation where guests rent the entire place' },
            { id: 'studio', label: 'Studio', description: 'Single-room apartment with combined living and sleeping area' },
            { id: 'penthouse', label: 'Penthouse', description: 'Luxury apartment on the top floor with premium amenities' },
            { id: 'loft', label: 'Loft', description: 'Open-plan apartment with high ceilings, often in converted buildings' }
        ],
        homes: [
            { id: 'villa', label: 'Villa', description: 'Luxurious standalone house with premium amenities and often a private pool' },
            { id: 'cottage', label: 'Cottage', description: 'Small, cozy house typically in rural or scenic locations' },
            { id: 'bungalow', label: 'Bungalow', description: 'Single-story house with a simple layout' },
            { id: 'townhouse', label: 'Townhouse', description: 'Multi-story house sharing walls with neighboring properties' },
            { id: 'vacation-home', label: 'Vacation Home', description: 'Fully furnished house designed for holiday rentals' },
            { id: 'farmhouse', label: 'Farmhouse', description: 'Rural house on a farm property with rustic charm' }
        ],
        hotel: [
            { id: 'hotel', label: 'Hotel', description: 'Accommodations for travelers often with restaurants, meeting rooms and other guest services' },
            { id: 'guesthouse', label: 'Guesthouse', description: 'Private home with separate living facilities for host and guest' },
            { id: 'homestay', label: 'Homestay', description: 'Private home with shared living facilities for host and guest' },
            { id: 'hostel', label: 'Hostel', description: 'Budget accommodations with mostly dorm-style beds and social atmosphere' },
            { id: 'capsule-hotel', label: 'Capsule Hotel', description: 'Extremely small units or capsules offering cheap and basic overnight accommodations' },
            { id: 'country-house', label: 'Country House', description: 'Private home in the countryside with simple accommodations' },
            { id: 'farm-stay', label: 'Farm Stay', description: 'Private farm with simple accommodations' },
            { id: 'resort', label: 'Resort', description: 'A place for relaxation with on-site restaurants, activities and offers a luxury feel' },
            { id: 'lodge', label: 'Lodge', description: 'Private home with accommodations surrounded by nature, such as a forest or mountains' },
            { id: 'bed-breakfast', label: 'Bed and breakfast', description: 'Private home offering overnight stays and breakfast' },
            { id: 'condo-hotel', label: 'Condo hotel', description: 'Independent apartments with some hotel facilities like a front desk' },
            { id: 'inn', label: 'Inn', description: 'Small property with basic accommodations and a rustic feel' },
            { id: 'love-hotel', label: 'Love Hotel', description: 'Adult-only accommodations rented by the hour or night' },
            { id: 'motel', label: 'Motel', description: 'Roadside hotel usually for motorists, with direct access to parking and fewer amenities' },
            { id: 'riad', label: 'Riad', description: 'Traditional Moroccan accommodations with a courtyard and luxury feel' },
            { id: 'ryokan', label: 'Ryokan', description: 'Traditional Japanese-style accommodations with meal options' }
        ],
        alternative: [
            { id: 'boat', label: 'Boat', description: 'Accommodation on a boat or houseboat' },
            { id: 'campground', label: 'Campground', description: 'Outdoor camping area with facilities for tents or RVs' },
            { id: 'luxury-tent', label: 'Luxury Tent', description: 'High-end glamping tent with premium amenities' },
            { id: 'caravan', label: 'Caravan/RV', description: 'Mobile home or recreational vehicle for accommodation' },
            { id: 'treehouse', label: 'Treehouse', description: 'Unique accommodation built in or around trees' },
            { id: 'yurt', label: 'Yurt', description: 'Traditional circular tent with modern comforts' }
        ]
    }

    // Get property types based on selected category
    const getPropertyTypes = () => {
        if (!selectedCategory) return []
        return propertyTypesByCategory[selectedCategory] || []
    }

    // Get the label of the selected property type
    const getSelectedPropertyTypeLabel = () => {
        if (!selectedPropertyType || !selectedCategory) return 'property'
        const types = propertyTypesByCategory[selectedCategory] || []
        const selectedType = types.find(type => type.id === selectedPropertyType)
        return selectedType ? selectedType.label.toLowerCase() : 'property'
    }


    const roomTypesList = ['Studio', 'Suite', 'Twin/Double', 'Triple/Quad', 'Family', 'Dorm', 'Shared Room', 'Bunk Room']

    const cities = ['Rishikesh', 'Haridwar', 'Dehradun', 'Mussoorie', 'Nainital', 'Delhi', 'Mumbai', 'Bangalore', 'Other']
    const ownershipTypes = ['Primary Property Ownership', 'Freehold', 'Leasehold', 'Strata Title', 'Partnership', 'Fractional Ownership', 'Joint Ownership (Co-ownership)']

    const facilities = [
        { id: 'restaurant', label: 'Restaurant' }, { id: 'bar', label: 'Bar' }, { id: 'free-wifi', label: 'Free Wi-Fi' },
        { id: 'room-service', label: 'Room service' }, { id: 'swimming-pool', label: 'Swimming pool' }, { id: 'parking', label: 'Parking' },
        { id: 'fitness-center', label: 'Fitness center' }, { id: 'spa', label: 'Spa' }, { id: 'hot-tub', label: 'Hot tub/Jacuzzi' },
        { id: 'sauna', label: 'Sauna' }, { id: 'air-conditioning', label: 'Air conditioning' }, { id: 'water-park', label: 'Water park' },
        { id: 'ev-charging', label: 'Electric vehicle charging station' }, { id: 'beach', label: 'Beach' },
        { id: 'terrace', label: 'Terrace' }, { id: 'garden', label: 'Garden' }, { id: 'non-smoking', label: 'Non-smoking rooms' },
        { id: 'airport-shuttle', label: 'Airport shuttle' }, { id: 'family-rooms', label: 'Family rooms' }
    ]

    const breakfastTypes = [
        'À la carte', 'American', 'Asian', 'Breakfast to go', 'Buffet', 'Continental',
        'Full English/Irish', 'Gluten-free', 'Halal', 'Italian', 'Kosher', 'Vegan', 'Vegetarian'
    ]
    const languages = [
        'English', 'Hindi', 'Arabic', 'Bulgarian', 'Catalan', 'Chinese', 'Croatian', 'Czech',
        'Danish', 'Dutch', 'Finnish', 'French', 'German', 'Greek', 'Hebrew', 'Hungarian',
        'Indonesian', 'Italian', 'Japanese', 'Korean', 'Malay', 'Norwegian', 'Polish',
        'Portuguese', 'Romanian', 'Russian', 'Spanish', 'Swedish', 'Thai', 'Turkish', 'Ukrainian', 'Vietnamese'
    ]

    // ADD THESE ARRAYS:
    const roomFacilitiesList = [
        'Clothes rack', 'Flat-screen TV', 'Air conditioning', 'Towels', 'Linens', 'Wake-up service/Alarm clock',
        'Towels/sheets (extra fee)', 'Heating', 'Fan', 'Safe', 'Toilet paper', 'Socket near the bed',
        'Shower', 'Toilet', 'Bathtub', 'Free toiletries', 'Hairdryer', 'Bathrobe', 'Slippers', 'Bidet',
        'Minibar', 'Terrace', 'View', 'Balcony', 'Dining table', 'Dining area'
    ]

    const bedTypesList = [
        { id: 'single', label: 'Single bed', size: '90-130 cm wide' },
        { id: 'twin', label: 'Twin bed/s', size: '90-130 cm wide' },
        { id: 'full', label: 'Full bed/s', size: '131-150 cm wide' },
        { id: 'queen', label: 'Queen bed/s', size: '151-180 cm wide' },
        { id: 'king', label: 'King bed/s', size: '181-210 cm wide' },
        { id: 'bunk', label: 'Bunk bed', size: 'Variable' },
        { id: 'sofa', label: 'Sofa bed', size: 'Variable' },
        { id: 'futon', label: 'Futon bed/s', size: 'Variable' }
    ]



    const onSubmit = async (data) => {
        setIsSubmitting(true)
        setSubmitStatus(null)

        try {
            const response = await fetch('/api/addPropertyRegistration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (response.ok && result.success) {
                setSubmitStatus({
                    type: 'success',
                    message: result.message || 'Property registration submitted successfully!',
                    propertyId: result.data?.id
                })

                // Optional: Reset form or redirect
                // reset()
                // router.push('/admin/properties')
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: result.error || 'Failed to submit property registration',
                    details: result.details
                })
            }
        } catch (error) {
            console.error('Submission error:', error)
            setSubmitStatus({
                type: 'error',
                message: 'Network error. Please check your connection and try again.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleContinue = () => {
        // All categories now go to Step 2 to select property type
        if (currentStep === 1 && selectedCategory) setCurrentStep(2)
        else if (currentStep === 2 && (selectedPropertyType || customPropertyType)) setCurrentStep(3)
        else if (currentStep === 3) setCurrentStep(4)
        else if (currentStep === 4) {
            if (propertyConfirmation === 'no') setCurrentStep(2)
            else if (propertyConfirmation === 'yes') setCurrentStep(5)
        }
        else if (currentStep === 5) {
            const addressLine1 = watch('addressLine1')
            const city = watch('city')
            const pinCode = watch('pinCode')
            if (addressLine1 && city && pinCode) setCurrentStep(6)
        }
        else if (currentStep === 6) setCurrentStep(7)
        else if (currentStep === 7) setCurrentStep(8)
        else if (currentStep === 8) setCurrentStep(9)
        else if (currentStep === 9) setCurrentStep(10)
        else if (currentStep === 10) setCurrentStep(11)
        else if (currentStep === 11) setCurrentStep(12)
        else if (currentStep === 12) setCurrentStep(13)
        else if (currentStep === 13) handleSubmit(onSubmit)()
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const incrementValue = (fieldName, currentValue) => setValue(fieldName, currentValue + 1)
    const decrementValue = (fieldName, currentValue) => {
        if (currentValue > 1) setValue(fieldName, currentValue - 1)
    }

    // Custom Facilities Modal Handlers
    const openFacilityModal = () => setIsFacilityModalOpen(true)
    const closeFacilityModal = () => {
        setIsFacilityModalOpen(false)
        setNewFacilityName('')
    }

    const handleAddCustomFacility = async () => {
        if (!newFacilityName.trim()) return

        setIsSavingFacility(true)
        try {
            const response = await fetch('/api/customFacilities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newFacilityName.trim() })
            })

            if (response.ok) {
                const data = await response.json()
                setCustomFacilities([...customFacilities, data.facility])
                setNewFacilityName('')
                closeFacilityModal()
            } else {
                alert('Failed to add custom facility')
            }
        } catch (error) {
            console.error('Error adding custom facility:', error)
            alert('Error adding custom facility')
        } finally {
            setIsSavingFacility(false)
        }
    }

    const deleteCustomFacility = async (facilityId) => {
        try {
            const response = await fetch(`/api/customFacilities?id=${facilityId}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setCustomFacilities(customFacilities.filter(f => f.id !== facilityId))
            } else {
                alert('Failed to delete facility')
            }
        } catch (error) {
            console.error('Error deleting facility:', error)
            alert('Error deleting facility')
        }
    }

    // ADD THESE FUNCTIONS:
    const openRoomModal = (index = null) => {
        if (index !== null) {
            setEditingRoomIndex(index)
            setCurrentRoomData(roomFields[index])
        } else {
            setEditingRoomIndex(null)
            setCurrentRoomData({
                roomName: '',
                roomType: '',
                bedTypes: [],
                roomSize: '',
                smokingAllowed: false,
                roomFacilities: [],
                pricePerNight: '',
                numberOfRooms: 1
            })
        }
        setIsRoomModalOpen(true)
    }

    const closeRoomModal = () => {
        setIsRoomModalOpen(false)
        setEditingRoomIndex(null)
        setCurrentRoomData({
            roomName: '',
            roomType: '',
            bedTypes: [],
            roomSize: '',
            smokingAllowed: false,
            roomFacilities: [],
            pricePerNight: '',
            numberOfRooms: 1
        })
    }

    const saveRoom = () => {
        if (editingRoomIndex !== null) {
            updateRoom(editingRoomIndex, currentRoomData)
        } else {
            appendRoom(currentRoomData)
        }
        closeRoomModal()
    }

    const updateRoomField = (field, value) => {
        setCurrentRoomData(prev => ({ ...prev, [field]: value }))
    }

    const toggleRoomFacility = (facility) => {
        setCurrentRoomData(prev => ({
            ...prev,
            roomFacilities: prev.roomFacilities.includes(facility)
                ? prev.roomFacilities.filter(f => f !== facility)
                : [...prev.roomFacilities, facility]
        }))
    }

    const updateBedType = (bedId, quantity) => {
        setCurrentRoomData(prev => {
            const existingBed = prev.bedTypes.find(b => b.id === bedId)
            if (quantity === 0) {
                return { ...prev, bedTypes: prev.bedTypes.filter(b => b.id !== bedId) }
            }
            if (existingBed) {
                return { ...prev, bedTypes: prev.bedTypes.map(b => b.id === bedId ? { ...b, quantity } : b) }
            }
            return { ...prev, bedTypes: [...prev.bedTypes, { id: bedId, quantity }] }
        })
    }

    const getBedQuantity = (bedId) => {
        const bed = currentRoomData.bedTypes.find(b => b.id === bedId)
        return bed ? bed.quantity : 0
    }

    const getStepTitle = () => {
        const titles = {
            1: "To get started, select the type of property you want to list on Booking.com",
            2: "From the list below, which property category is the best fit for your place?",
            3: "How many hotels are you listing?",
            4: "One hotel where guests can book a room",
            5: "Where is your property?",
            6: "Tell us about your hotel",
            7: "Services at your property?",
            8: "What languages do you or your staff speak?",
            9: "House Rules",
            10: "Add rooms"
        }
        return titles[currentStep] || ""
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Step Progress Indicator */}
                <div className="mb-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Step Counter Text */}
                        <div className="text-center mb-4">
                            <p className="text-lg font-semibold text-gray-700">
                                Step {currentStep} of 13
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex gap-1">
                            {Array.from({ length: 13 }, (_, i) => i + 1).map((step) => {
                                const stepColors = [
                                    'bg-teal-500',      // Step 1
                                    'bg-orange-500',    // Step 2
                                    'bg-blue-500',      // Step 3
                                    'bg-indigo-500',    // Step 4
                                    'bg-purple-500',    // Step 5
                                    'bg-pink-500',      // Step 6
                                    'bg-rose-500',      // Step 7
                                    'bg-red-500',       // Step 8
                                    'bg-amber-500',     // Step 9
                                    'bg-yellow-500',    // Step 10
                                    'bg-lime-500',      // Step 11
                                    'bg-green-500',     // Step 12
                                    'bg-emerald-500'    // Step 13
                                ];

                                return (
                                    <div
                                        key={step}
                                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${step <= currentStep ? stepColors[step - 1] : 'bg-gray-300'
                                            }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight px-4">
                        {getStepTitle()}
                    </h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
                    {/* Submission Status Notification */}
                    {submitStatus && (
                        <div className={`mb-6 p-4 rounded-lg border-2 ${submitStatus.type === 'success'
                            ? 'bg-green-50 border-green-500 text-green-800'
                            : 'bg-red-50 border-red-500 text-red-800'
                            }`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-1">
                                        {submitStatus.type === 'success' ? '✅ Success!' : '❌ Error'}
                                    </h3>
                                    <p className="text-sm">{submitStatus.message}</p>
                                    {submitStatus.propertyId && (
                                        <p className="text-xs mt-2">Property ID: {submitStatus.propertyId}</p>
                                    )}
                                    {submitStatus.details && (
                                        <ul className="text-xs mt-2 list-disc list-inside">
                                            {submitStatus.details.map((detail, idx) => (
                                                <li key={idx}>{detail.field}: {detail.message}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSubmitStatus(null)}
                                    className="ml-4 text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Property Category */}
                    {currentStep === 1 && (
                        <div className="">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {propertyCategories.map((category) => (
                                    <div key={category.id} className="relative group">
                                        <input type="radio" id={category.id} value={category.id}
                                            {...register('category', { required: 'Please select a property category' })}
                                            className="absolute opacity-0 pointer-events-none peer" />
                                        <label htmlFor={category.id}
                                            className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-300 ease-out h-full min-h-[320px] relative hover:border-blue-600 hover:shadow-xl hover:-translate-y-1 peer-checked:border-blue-600 peer-checked:bg-gradient-to-br peer-checked:from-blue-50 peer-checked:to-white peer-checked:shadow-xl">
                                            {category.quickStart && (
                                                <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-500 to-teal-400 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md">
                                                    <span className="text-sm">⚡</span><span>Quick start</span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-blue-600 text-white items-center justify-center font-bold text-sm opacity-0 scale-0 transition-all duration-300 hidden peer-checked:flex peer-checked:opacity-100 peer-checked:scale-100 peer-checked:animate-checkmark">✓</div>
                                            <div className="my-6">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                                                    {category.icon}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{category.label}</h3>
                                            <p className="text-sm text-gray-600 text-center leading-relaxed mb-6 flex-grow">{category.description}</p>
                                            <button type="button"
                                                className="w-full mt-auto px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-semibold transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                                                onClick={(e) => { e.preventDefault(); document.getElementById(category.id).click(); setTimeout(() => handleContinue(), 100) }}>
                                                List your property
                                            </button>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {errors.category && (
                                <div className="text-red-700 text-sm text-center mt-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-700">
                                    {errors.category.message}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Property Type */}
                    {currentStep === 2 && (
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {getPropertyTypes().map((type) => {
                                    const isSelected = selectedPropertyType === type.id;
                                    return (
                                        <div key={type.id} className="relative">
                                            <input type="radio" id={type.id} value={type.id}
                                                {...register('propertyType', { required: !customPropertyType ? 'Please select a property type or check the custom option' : false })}
                                                className="sr-only" />
                                            <label htmlFor={type.id}
                                                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                                                    ? 'border-blue-600 bg-blue-50 shadow-md'
                                                    : 'border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                                                    }`}>
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${isSelected
                                                            ? 'border-blue-600 bg-blue-600'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            <div className={`w-2 h-2 rounded-full bg-white transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'
                                                                }`}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4 className="font-semibold text-gray-900 mb-1">{type.label}</h4>
                                                        <p className="text-sm text-gray-600 leading-snug">{type.description}</p>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" {...register('customPropertyType')}
                                        className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer" />
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-600 text-lg">ℹ️</span>
                                            <span className="font-semibold text-blue-900 group-hover:text-blue-700">I don't see my property type on the list</span>
                                        </div>
                                        <p className="text-sm text-blue-700 mt-1">Check this if your property type is not listed above</p>
                                    </div>
                                </label>
                            </div> */}
                        </div>
                    )}

                    {/* Step 3: Property Size */}
                    {currentStep === 3 && (
                        <div className="mb-8">
                            <div className="mb-8 p-5 bg-blue-50 border-2 border-blue-300 rounded-lg flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">🏨</div>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-gray-800 leading-relaxed"><span className="font-semibold">One {getSelectedPropertyTypeLabel()} with one or multiple rooms that guests can book</span></p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                                </div>
                            </div>
                            <div className="mb-8">
                                <div className="flex items-center justify-between max-w-md">
                                    <label className="text-lg font-semibold text-gray-900">No Of Rooms</label>
                                    <div className="flex items-center gap-3">
                                        <button type="button" onClick={() => decrementValue('numberOfRooms', numberOfRooms)}
                                            className="w-12 h-12 bg-green-100 hover:bg-green-200 text-gray-800 font-bold text-xl rounded-full transition-all duration-200 flex items-center justify-center border-2 border-green-300 active:scale-95">&lt;</button>
                                        <Controller name="numberOfRooms" control={control} rules={{ required: true, min: 1 }}
                                            render={({ field }) => (
                                                <input {...field} type="number" min="1" readOnly
                                                    className="w-20 h-12 text-center text-xl font-bold bg-green-100 border-2 border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" />
                                            )} />
                                        <button type="button" onClick={() => incrementValue('numberOfRooms', numberOfRooms)}
                                            className="w-12 h-12 bg-green-100 hover:bg-green-200 text-gray-800 font-bold text-xl rounded-full transition-all duration-200 flex items-center justify-center border-2 border-green-300 active:scale-95">&gt;</button>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-8">
                                <div className="flex items-center justify-between max-w-md">
                                    <label className="text-lg font-semibold text-gray-900">No Of Floors</label>
                                    <div className="flex items-center gap-3">
                                        <button type="button" onClick={() => decrementValue('numberOfFloors', numberOfFloors)}
                                            className="w-12 h-12 bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-bold text-xl rounded-full transition-all duration-200 flex items-center justify-center border-2 border-yellow-300 active:scale-95">&lt;</button>
                                        <Controller name="numberOfFloors" control={control} rules={{ required: true, min: 1 }}
                                            render={({ field }) => (
                                                <input {...field} type="number" min="1" readOnly
                                                    className="w-20 h-12 text-center text-xl font-bold bg-yellow-100 border-2 border-yellow-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                                            )} />
                                        <button type="button" onClick={() => incrementValue('numberOfFloors', numberOfFloors)}
                                            className="w-12 h-12 bg-yellow-100 hover:bg-yellow-200 text-gray-800 font-bold text-xl rounded-full transition-all duration-200 flex items-center justify-center border-2 border-yellow-300 active:scale-95">&gt;</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Property Confirmation */}
                    {currentStep === 4 && (
                        <div className="mb-8">
                            <div className="mb-8">
                                <p className="text-lg text-black font-bold underline mb-6">You're listing:</p>
                                <div className="flex justify-center items-center mb-8 gap-4">
                                    <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center text-5xl mb-4">🏨</div>
                                    <div>

                                        {selectedPropertyType && (
                                            <div className="text-center max-w-md">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                                                    {(() => {
                                                        const types = propertyTypesByCategory[selectedCategory] || []
                                                        const selectedType = types.find(type => type.id === selectedPropertyType)
                                                        return selectedType ? selectedType.label : ''
                                                    })()}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {(() => {
                                                        const types = propertyTypesByCategory[selectedCategory] || []
                                                        const selectedType = types.find(type => type.id === selectedPropertyType)
                                                        return selectedType ? selectedType.description : ''
                                                    })()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Does this sound like your property?</h2>
                                <div className="max-w-md flex items-center gap-2 flex-row-reverse w-full">
                                    <div>
                                        <input type="radio" id="confirm-yes" value="yes"
                                            {...register('propertyConfirmation', { required: 'Please select an option' })}
                                            className="absolute opacity-0 pointer-events-none peer" />
                                        <label htmlFor="confirm-yes"
                                            className="block p-4 border-2 border-gray-300 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:shadow-md text-center font-semibold text-gray-800">
                                            Yes, this sounds right
                                        </label>
                                    </div>
                                    <div>
                                        <input type="radio" id="confirm-no" value="no"
                                            {...register('propertyConfirmation', { required: 'Please select an option' })}
                                            className="absolute opacity-0 pointer-events-none peer" />
                                        <label htmlFor="confirm-no"
                                            className="block p-4 border-2 border-blue-300 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:shadow-md text-center font-semibold text-blue-600">
                                            No, I need to make a change
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Property Location */}
                    {currentStep === 5 && (
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-2xl">G</div>
                            </div>
                            <div className="space-y-4 max-w-2xl">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Apartment or floor number (optional)</label>
                                    <input type="text" {...register('apartmentOrFloor')}
                                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Apartment or floor number" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">1st Address Line *</label>
                                    <input type="text" {...register('addressLine1', { required: 'Address Line 1 is required' })}
                                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="1st Address Line" />
                                    {errors.addressLine1 && <p className="text-red-600 text-sm mt-1">{errors.addressLine1.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">2nd Address Line</label>
                                    <input type="text" {...register('addressLine2')}
                                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="2nd Address Line" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">City Location *</label>
                                    <input type="text" {...register('city', { required: 'City is required' })}
                                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="City Location" />
                                    {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Pin Code *</label>
                                    <input type="text" {...register('pinCode', { required: 'Pin Code is required' })}
                                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Pin Code" />
                                    {errors.pinCode && <p className="text-red-600 text-sm mt-1">{errors.pinCode.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Google Location Code</label>
                                    <input type="text" {...register('googleLocationCode')}
                                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Google Location Code" />
                                    <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                                        <span>🔶</span>
                                        <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline">
                                            Follow this https://www.google.com/maps For Help
                                        </a>

                                    </p>
                                    <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                                        <span>🔶</span>
                                        <a href="https://support.google.com/maps/answer/15437054?hl=en&co=GENIE.Pla tform%3DAndroid" target="_blank" rel="noopener noreferrer" className="underline">
                                            For Help https://support.google.com/maps/answer/15437054?hl=en&co=GENIE.Pla tform%3DAndroid
                                        </a>
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Google Business Profile Code</label>
                                    <input type="text" {...register('googleBusinessProfileCode')}
                                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Google Business Profile Code" />
                                    <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                                        <span>🔶</span>
                                        <a href="https://support.google.com/business" target="_blank" rel="noopener noreferrer" className="underline">
                                            Follow This https://support.google.com/business
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 6: Property Details & Facilities */}
                    {currentStep === 6 && (
                        <div className="mb-8 flex md:flex-row flex-col items-start gap-3">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 border-2 border-gray-800 rounded-full flex items-center justify-center text-2xl">📍</div>
                            </div>
                            <div className="space-y-8 w-full">
                                <div className="flex items-center gap-3">
                                    <label className="block text-xl font-semibold text-gray-900 mb-2">What's the name of your {getSelectedPropertyTypeLabel()}?</label>
                                    <div>
                                        <input type="text" {...register('propertyName', { required: 'Property name is required' })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder={getSelectedPropertyTypeLabel() + " Name"} />
                                        <p className="text-xs text-gray-500 mt-1">Guests will see this name when searching for a place to stay.</p>
                                        {errors.propertyName && <p className="text-red-600 text-sm mt-1">{errors.propertyName.message}</p>}
                                    </div>
                                </div>
                                <div className='flex items-start md:flex-row flex-col gap-3'>
                                    <label className="block text-xl font-semibold text-gray-900 mb-3">What is the star rating of your {getSelectedPropertyTypeLabel()}?</label>
                                    <div className="space-y-1">
                                        {[
                                            { value: 'na', label: 'N/A', stars: '' },
                                            { value: '1', label: '1 star', stars: '⭐' },
                                            { value: '2', label: '2 stars', stars: '⭐⭐' },
                                            { value: '3', label: '3 stars', stars: '⭐⭐⭐' },
                                            { value: '4', label: '4 stars', stars: '⭐⭐⭐⭐' },
                                            { value: '5', label: '5 stars', stars: '⭐⭐⭐⭐⭐' }
                                        ].map((rating) => {
                                            const isSelected = watch('starRating') === rating.value;
                                            return (
                                                <div key={rating.value}>
                                                    <input type="radio" id={`star-${rating.value}`} value={rating.value}
                                                        {...register('starRating', { required: 'Please select a star rating' })}
                                                        className="sr-only" />
                                                    <label htmlFor={`star-${rating.value}`}
                                                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                                                            }`}>
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                                                            }`}>
                                                            <div className={`w-2.5 h-2.5 rounded-full bg-white transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'
                                                                }`}></div>
                                                        </div>
                                                        <span className="text-gray-800">{rating.label}</span>
                                                        <span className="text-lg">{rating.stars}</span>
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xl font-semibold text-gray-900 mb-3">Are you a property management company or part of a group or chain?</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="true" {...register('isChainProperty')} className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="false" {...register('isChainProperty')} className="w-5 h-5 text-blue-600" defaultChecked />
                                            <span className="text-gray-800">No</span>
                                        </label>
                                    </div>
                                </div>
                                {isChainProperty === 'true' && (
                                    <div>
                                        <label className="block text-xl font-semibold text-gray-900 mb-2">If Yes Provide Name Of Group Or Chain Management</label>
                                        <input type="text" {...register('chainName')}
                                            className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Chain or Group Name" />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xl font-semibold text-gray-900 mb-2">Property Ownership Type</label>
                                    <select {...register('ownershipType', { required: 'Please select ownership type' })}
                                        className="w-full px-4 py-3 bg-white border-2 border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select Here</option>
                                        {ownershipTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left side - Facilities */}
                                    <div className="lg:col-span-2">
                                        <label className="block text-xl font-semibold text-gray-900 mb-3">What can guests use at your {getSelectedPropertyTypeLabel()}?</label>
                                        <div className="grid grid-cols-2 gap-1 mb-4">
                                            {facilities.map((facility) => (
                                                <label key={facility.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input type="checkbox" value={facility.id} {...register('facilities')}
                                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                                    <span className="text-sm text-gray-800">{facility.label}</span>
                                                </label>
                                            ))}
                                            {/* Custom Facilities */}
                                            {customFacilities.map((facility) => (
                                                <div key={facility.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                                                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                                                        <input type="checkbox" value={facility.id} {...register('facilities')}
                                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                                        <span className="text-sm text-gray-800">{facility.name}</span>
                                                    </label>
                                                    {/* <button
                                                        type="button"
                                                        onClick={() => deleteCustomFacility(facility._id)}
                                                        className="text-red-500 hover:text-red-700 text-xs"
                                                    >
                                                        ✕
                                                    </button> */}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={openFacilityModal}
                                            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                        >
                                            <span className="text-xl">+</span> Add More
                                        </button>
                                    </div>

                                    {/* Right side - Info Box */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 sticky top-4">
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="text-2xl">💡</span>
                                                <h3 className="font-bold text-gray-900">What if I don't see a facility I offer?</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                The facilities listed here are the ones guests search for most. After you complete your registration, you can add more facilities from a larger list on the Extranet, the platform you'll use to manage your property.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 7: Services (Breakfast & Parking) */}
                    {currentStep === 7 && (
                        <div className="mb-8">
                            <div className="space-y-8 max-w-2xl">
                                {/* Breakfast Section */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Breakfast</h2>

                                    <div className="mb-6">
                                        <label className="block text-xl font-semibold text-gray-900 mb-3">Do you serve guests breakfast?</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" value="true" {...register('servesBreakfast')} className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-800">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" value="false" {...register('servesBreakfast')} className="w-5 h-5 text-blue-600" defaultChecked />
                                                <span className="text-gray-800">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {servesBreakfast === 'true' && (
                                        <>
                                            <div className="mb-6">
                                                <label className="block text-base font-semibold text-gray-900 mb-3">Is breakfast included in the price guests pay?</label>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" value="true" {...register('breakfastIncluded')} className="w-5 h-5 text-blue-600" />
                                                        <span className="text-gray-800">Yes, it's included</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" value="false" {...register('breakfastIncluded')} className="w-5 h-5 text-blue-600" />
                                                        <span className="text-gray-800">No, it costs extra</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {breakfastIncluded === 'false' && (
                                                <div className="mb-6">
                                                    <label className="block text-base font-semibold text-gray-900 mb-2">Breakfast price per person, per day</label>
                                                    <input type="number" {...register('breakfastPricePerPerson')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="INR" />
                                                    <p className="text-xs text-gray-500 mt-1">Including all taxes and fees</p>
                                                </div>
                                            )}

                                            <div className="mb-6">
                                                <label className="block text-base font-semibold text-gray-900 mb-3">What type of breakfast do you offer?</label>
                                                <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {breakfastTypes.map((type) => (
                                                        <label key={type} className="inline-flex items-center px-4 py-2 border-2 border-gray-300 rounded-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                                                            <input type="checkbox" value={type} {...register('breakfastTypes')} className="sr-only" />
                                                            <span className="text-sm text-gray-800">{type}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Parking Section */}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Parking Provision</h2>

                                    <div className="mb-6">
                                        <label className="block text-base font-semibold text-gray-900 mb-3">Is parking available to guests?</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" value="true" {...register('parkingAvailable')} className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-800">Yes, free</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" value="paid" {...register('parkingAvailable')} className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-800">Yes, paid</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" value="false" {...register('parkingAvailable')} className="w-5 h-5 text-blue-600" defaultChecked />
                                                <span className="text-gray-800">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {(parkingAvailable === 'true' || parkingAvailable === 'paid') && (
                                        <>
                                            {parkingAvailable === 'paid' && (
                                                <div className="mb-6">
                                                    <label className="block text-xl font-semibold text-gray-900 mb-3">How much does parking cost?</label>
                                                    <div className="flex gap-3">
                                                        <input type="number" {...register('parkingCost')}
                                                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="INR" />
                                                        <select {...register('parkingCostPeriod')}
                                                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                            <option value="per-day">Per day</option>
                                                            <option value="per-hour">Per hour</option>
                                                            <option value="per-stay">Per stay</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mb-6">
                                                <label className="block text-base font-semibold text-gray-900 mb-3">Do guests need to reserve a parking spot?</label>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" value="required" {...register('parkingReservation')} className="w-5 h-5 text-blue-600" />
                                                        <span className="text-gray-800">Reservation needed</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" value="not-required" {...register('parkingReservation')} className="w-5 h-5 text-blue-600" />
                                                        <span className="text-gray-800">No reservation needed</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <label className="block text-base font-semibold text-gray-900 mb-3">Where is the parking located?</label>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" value="on-site" {...register('parkingLocation')} className="w-5 h-5 text-blue-600" />
                                                        <span className="text-gray-800">On site</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" value="off-site" {...register('parkingLocation')} className="w-5 h-5 text-blue-600" />
                                                        <span className="text-gray-800">Off site</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <label className="block text-base font-semibold text-gray-900 mb-3">What type of parking is it?</label>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" value="private" {...register('parkingType')} className="w-5 h-5 text-blue-600" />
                                                        <span className="text-gray-800">Private</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" value="public" {...register('parkingType')} className="w-5 h-5 text-blue-600" />
                                                        <span className="text-gray-800">Public</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 8: Languages Spoken */}
                    {currentStep === 8 && (
                        <div className="mb-8">
                            <div className="space-y-6 max-w-2xl">
                                <div>
                                    <label className="block text-base font-semibold text-gray-900 mb-3">Select languages</label>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input type="checkbox" value="English" {...register('languages')} className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                            <span className="text-gray-800">English</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input type="checkbox" value="Hindi" {...register('languages')} className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                            <span className="text-gray-800">Hindi</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-gray-900 mb-3">Add additional languages</label>
                                    <select {...register('additionalLanguages')} multiple
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white h-48">
                                        {languages.filter(lang => lang !== 'English' && lang !== 'Hindi').map((lang) => (
                                            <option key={lang} value={lang} className="py-2">{lang}</option>
                                        ))}
                                    </select>
                                    <p className="text-sm text-gray-500 mt-2">Hold Ctrl (Windows) or Cmd (Mac) to select multiple languages</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 9: House Rules */}
                    {currentStep === 9 && (
                        <div className="mb-8">
                            <div className="space-y-8 max-w-2xl">
                                <div>
                                    <label className="block text-base font-semibold text-gray-900 mb-4">What are your check-in and check-out times?</label>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">From</label>
                                                    <select {...register('checkInFrom', { required: 'Check-in time is required' })}
                                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                        <option value="">Select time</option>
                                                        {Array.from({ length: 24 }, (_, i) => (
                                                            <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                                                {`${i.toString().padStart(2, '0')}:00`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Until</label>
                                                    <select {...register('checkInUntil', { required: 'Check-in until time is required' })}
                                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                        <option value="">Select time</option>
                                                        {Array.from({ length: 24 }, (_, i) => (
                                                            <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                                                {`${i.toString().padStart(2, '0')}:00`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">From</label>
                                                    <select {...register('checkOutFrom', { required: 'Check-out time is required' })}
                                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                        <option value="">Select time</option>
                                                        {Array.from({ length: 24 }, (_, i) => (
                                                            <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                                                {`${i.toString().padStart(2, '0')}:00`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-600 mb-1">Until</label>
                                                    <select {...register('checkOutUntil', { required: 'Check-out until time is required' })}
                                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                        <option value="">Select time</option>
                                                        {Array.from({ length: 24 }, (_, i) => (
                                                            <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                                                {`${i.toString().padStart(2, '0')}:00`}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-gray-900 mb-3">Do you allow children?</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="true" {...register('allowChildren')} className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="false" {...register('allowChildren')} className="w-5 h-5 text-blue-600" defaultChecked />
                                            <span className="text-gray-800">No</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-base font-semibold text-gray-900 mb-3">Do you allow pets?</label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="yes" {...register('allowPets')} className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Yes</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="upon-request" {...register('allowPets')} className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Upon request</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value="no" {...register('allowPets')} className="w-5 h-5 text-blue-600" defaultChecked />
                                            <span className="text-gray-800">No</span>
                                        </label>
                                    </div>
                                </div>

                                {(allowPets === 'yes' || allowPets === 'upon-request') && (
                                    <div>
                                        <label className="block text-base font-semibold text-gray-900 mb-3">Are there additional fees for pets?</label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" value="false" {...register('petCharges')} className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-800">Pets can stay for free</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" value="true" {...register('petCharges')} className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-800">Fees may apply</span>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentStep === 10 && (
                        <div className="mb-8">
                            <div className="space-y-6">
                                {/* Progress Steps */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                                        <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-900">Step 1 - Property details</h3>
                                            <p className="text-sm text-gray-600">The basics: Add your property name, address, facilities, and more</p>
                                        </div>
                                        <button type="button" onClick={() => setCurrentStep(1)} className="text-blue-600 font-semibold hover:underline">Edit</button>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border-2 border-blue-400 rounded-lg">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">🛏️</div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-900">Step 2 - Rooms</h3>
                                            <p className="text-sm text-gray-600">Tell us about your first room. Once you set one up you can add more</p>
                                        </div>
                                        <button type="button" onClick={() => openRoomModal()}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                                            Add room
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">📷</div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-900">Step 3 - Photos</h3>
                                            <p className="text-sm text-gray-600">Show some photos of your property so guests know what to expect</p>
                                        </div>
                                        <button type="button" onClick={() => setCurrentStep(11)}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                                            Add photos
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">✅</div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-900">Step 4 - Final steps</h3>
                                            <p className="text-sm text-gray-600">Set up payments and invoices before you open for bookings</p>
                                        </div>
                                        <button type="button" onClick={() => setCurrentStep(13)}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                                            Add final details
                                        </button>
                                    </div>
                                </div>
                                {/* Rooms List */}
                                {roomFields.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Rooms ({roomFields.length})</h3>
                                        <div className="space-y-3">
                                            {roomFields.map((room, index) => (
                                                <div key={room.id} className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                                                    <div className="flex-grow">
                                                        <h4 className="font-semibold text-gray-900">{room.roomName || `Room ${index + 1}`}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {room.bedTypes?.length > 0 && `${room.bedTypes.map(b => `${b.quantity}x ${bedTypesList.find(bt => bt.id === b.id)?.label}`).join(', ')} • `}
                                                            {room.roomSize && `${room.roomSize} m² • `}
                                                            ₹{room.pricePerNight}/night
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button type="button" onClick={() => openRoomModal(index)}
                                                            className="px-4 py-2 text-blue-600 border-2 border-blue-600 rounded-md font-semibold hover:bg-blue-50 transition-colors">
                                                            Edit
                                                        </button>
                                                        <button type="button" onClick={() => removeRoom(index)}
                                                            className="px-4 py-2 text-red-600 border-2 border-red-600 rounded-md font-semibold hover:bg-red-50 transition-colors">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 11: Room Images */}
                    {currentStep === 11 && (
                        <div className="mb-8">
                            <div className="bg-white rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Room Images</h2>
                                <p className="text-gray-600 mb-6">Upload images for each room you've added</p>

                                {roomFields.length > 0 ? (
                                    <div className="space-y-6">
                                        {roomFields.map((room, index) => (
                                            <div key={room.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {room.roomType || `Room ${index + 1}`}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">₹{room.pricePerNight}/night</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button type="button" className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">View</button>
                                                        <button type="button" className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">Edit</button>
                                                        <button type="button" className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200">Delete</button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Image</label>
                                                        <button type="button" className="w-full px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                                                            Upload Image
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Room Image</label>
                                                        <button type="button" className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                                            Upload Image
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bathroom Image</label>
                                                        <button type="button" className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                                            Upload Image
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <p className="text-gray-600">No rooms added yet. Please add rooms in Step 10.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 12: Property Images */}
                    {currentStep === 12 && (
                        <div className="mb-8">
                            <div className="bg-white rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Image Information</h2>
                                <p className="text-gray-600 mb-6">Upload images for different areas of your property</p>

                                <div className="space-y-4">
                                    {[
                                        { id: 'primary', label: 'Primary Image', color: 'teal' },
                                        { id: 'exterior', label: 'Exterior Image', color: 'blue' },
                                        { id: 'interior', label: 'Interior Image', color: 'green' },
                                        { id: 'reception', label: 'Reception Image', color: 'green' },
                                        { id: 'restaurant', label: 'Restaurant Image', color: 'green' },
                                        { id: 'parking', label: 'Parking Image', color: 'green' },
                                        { id: 'other', label: 'Other Image', color: 'green' }
                                    ].map((category) => (
                                        <div key={category.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                                            <label className="text-base font-semibold text-gray-900 flex-1">{category.label}</label>
                                            <div className="flex gap-3 items-center">
                                                <button type="button"
                                                    className={`px-6 py-2 bg-${category.color}-500 text-white rounded-lg hover:bg-${category.color}-600 transition-colors font-semibold`}
                                                    style={{ backgroundColor: category.color === 'teal' ? '#14b8a6' : category.color === 'blue' ? '#3b82f6' : '#22c55e' }}>
                                                    Upload Image
                                                </button>
                                                <button type="button" className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">View</button>
                                                <button type="button" className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">Edit</button>
                                                <button type="button" className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 text-center">
                                    <button type="button" className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                                        Data Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 13: Owner, Property & Bank Information */}
                    {currentStep === 13 && (
                        <div className="mb-8">
                            <div className="bg-white rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8">Personal Information</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column - Owner Information */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Owner Information */}
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Owner Information</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Owner Name</label>
                                                    <input type="text" {...register('ownerName')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        placeholder="Type Here" style={{ backgroundColor: '#14b8a6', color: 'white' }} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                                    <input type="email" {...register('ownerEmail')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        placeholder="Type Here" style={{ backgroundColor: '#14b8a6', color: 'white' }} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                                                    <input type="tel" {...register('ownerContact')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        placeholder="Type Here" style={{ backgroundColor: '#14b8a6', color: 'white' }} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pan Number</label>
                                                    <div className="flex gap-2">
                                                        <input type="text" {...register('panNumber')}
                                                            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                            placeholder="Type Here" style={{ backgroundColor: '#14b8a6', color: 'white' }} />
                                                        <button type="button" className="px-6 py-3 bg-white border-2 border-teal-500 text-teal-600 rounded-lg font-semibold hover:bg-teal-50">
                                                            Upload Document
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Number</label>
                                                    <input type="text" {...register('aadhaarNumber')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        placeholder="Type Here" style={{ backgroundColor: '#14b8a6', color: 'white' }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Property Information */}
                                        <div className="border-t border-gray-200 pt-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Information</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Property Name</label>
                                                    <input type="text" {...register('officialPropertyName')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Type Here" style={{ backgroundColor: '#4f46e5', color: 'white' }} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Official Email</label>
                                                    <input type="email" {...register('officialEmail')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Type Here" style={{ backgroundColor: '#4f46e5', color: 'white' }} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                                                        <input type="tel" {...register('officialContact')}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="Type Here" style={{ backgroundColor: '#4f46e5', color: 'white' }} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Alternative Contact</label>
                                                        <input type="tel" {...register('alternativeContact')}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="Type Here" style={{ backgroundColor: '#4f46e5', color: 'white' }} />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pan Number</label>
                                                        <input type="text" {...register('propertyPanNumber')}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="Type Here" style={{ backgroundColor: '#4f46e5', color: 'white' }} />
                                                    </div>
                                                    <div>
                                                        <button type="button" className="w-full mt-7 px-6 py-3 bg-white border-2 border-indigo-500 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50">
                                                            Upload Document
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number</label>
                                                        <input type="text" {...register('gstNumber')}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="Type Here" style={{ backgroundColor: '#4f46e5', color: 'white' }} />
                                                    </div>
                                                    <div>
                                                        <button type="button" className="w-full mt-7 px-6 py-3 bg-white border-2 border-indigo-500 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50">
                                                            Upload Document
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bank Information */}
                                        <div className="border-t border-gray-200 pt-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Bank Information</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                                                    <input type="text" {...register('accountNumber')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Type Here" style={{ backgroundColor: '#a855f7', color: 'white' }} />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">A/C Holder Name</label>
                                                    <input type="text" {...register('accountHolderName')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Type Here" style={{ backgroundColor: '#a855f7', color: 'white' }} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                                                        <input type="text" {...register('ifscCode')}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            placeholder="Type Here" style={{ backgroundColor: '#a855f7', color: 'white' }} />
                                                    </div>
                                                    <div>
                                                        <button type="button" className="w-full mt-7 px-6 py-3 bg-white border-2 border-purple-500 text-purple-600 rounded-lg font-semibold hover:bg-purple-50">
                                                            Cheque Upload Document
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Address</label>
                                                    <input type="text" {...register('bankAddress')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Type Here" style={{ backgroundColor: '#a855f7', color: 'white' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Profile Photo */}
                                    <div className="lg:col-span-1">
                                        <div className="sticky top-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Profile Photo</label>
                                            <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300">
                                                <span className="text-gray-400 text-sm">Upload Photo</span>
                                            </div>
                                            <button type="button" className="w-full mt-4 px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600">
                                                Choose File
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200 gap-4">
                        {currentStep > 1 && (
                            <button type="button"
                                className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg text-base font-semibold transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 active:scale-95"
                                onClick={handleBack}>
                                &lt; Back
                            </button>
                        )}

                        <button type="button"
                            className={`${currentStep === 1 ? 'mx-auto' : 'ml-auto'} min-w-[200px] px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-base font-semibold transition-all duration-300 shadow-lg hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-60 disabled:transform-none`}
                            onClick={handleContinue}
                            disabled={
                                isSubmitting ||
                                (currentStep === 1 && !selectedCategory) ||
                                (currentStep === 2 && !selectedPropertyType && !customPropertyType) ||
                                (currentStep === 4 && !propertyConfirmation) ||
                                (currentStep === 10 && roomFields.length === 0)
                            }>
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                currentStep === 13 ? 'Submit' : 'Continue'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {isRoomModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                            <h2 className="text-2xl font-bold text-gray-900">Room details</h2>
                            <button type="button" onClick={closeRoomModal}
                                className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors text-xl font-bold">
                                ×
                            </button>
                        </div>
                        <div className="p-6 w-full gap-4">
                            <div className="p-6 flex flex-col lg:flex-row w-full gap-8">
                                <div className="lg:w-1/2 space-y-8">
                                    {/* Room Type */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-900 mb-3">What type of unit is this?</label>
                                        <select value={currentRoomData.roomType} onChange={(e) => updateRoomField('roomType', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">Select room type</option>
                                            {roomTypesList.map(type => <option key={type} value={type}>{type}</option>)}
                                        </select>
                                    </div>

                                    {/* Room Name */}
                                    {/* <div>
                                <label className="block text-base font-semibold text-gray-900 mb-3">Room name (optional)</label>
                                <input type="text" value={currentRoomData.roomName} onChange={(e) => updateRoomField('roomName', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Deluxe Double Room" />
                            </div> */}

                                    {/* How many guests can stay */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-900 mb-3">How many guests can stay in this room?</label>
                                        <div className="flex items-center gap-3">
                                            <button type="button"
                                                onClick={() => updateRoomField('maxGuests', Math.max(1, (currentRoomData.maxGuests || 1) - 1))}
                                                className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 font-bold text-xl">-</button>
                                            <input type="number" min="1" value={currentRoomData.maxGuests || 1}
                                                onChange={(e) => updateRoomField('maxGuests', parseInt(e.target.value))}
                                                className="w-20 px-4 py-3 border-2 border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                            <button type="button"
                                                onClick={() => updateRoomField('maxGuests', (currentRoomData.maxGuests || 1) + 1)}
                                                className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 font-bold text-xl">+</button>
                                        </div>
                                    </div>

                                    {/* Room Size */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-900 mb-3">How big is this room?</label>
                                        <div className="flex gap-3">
                                            <input type="number" min="1" value={currentRoomData.roomSize} onChange={(e) => updateRoomField('roomSize', e.target.value)}
                                                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Room size" />
                                            <select value={currentRoomData.roomSizeUnit || 'square-meters'}
                                                onChange={(e) => updateRoomField('roomSizeUnit', e.target.value)}
                                                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                <option value="square-meters">square meters</option>
                                                <option value="square-feet">square feet</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Smoking Allowed */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-900 mb-3">Is smoking allowed in this room?</label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" checked={currentRoomData.smokingAllowed === true}
                                                    onChange={() => updateRoomField('smokingAllowed', true)} className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-800">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" checked={currentRoomData.smokingAllowed === false}
                                                    onChange={() => updateRoomField('smokingAllowed', false)} className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-800">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Is the bathroom private */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-900 mb-3">Is the bathroom private?</label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" checked={currentRoomData.privateBathroom === true}
                                                    onChange={() => updateRoomField('privateBathroom', true)} className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-800">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" checked={currentRoomData.privateBathroom === false}
                                                    onChange={() => updateRoomField('privateBathroom', false)} className="w-5 h-5 text-blue-600" />
                                                <span className="text-gray-800">No, it's shared</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Bathroom Items */}
                                    {currentRoomData.privateBathroom !== false && (
                                        <div>
                                            <label className="block text-base font-semibold text-gray-900 mb-3">What bathroom items are available in this room?</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Toilet paper', 'Towels', 'Toilet', 'Shower', 'Bathtub', 'Free toiletries', 'Hairdryer', 'Slippers', 'Bathrobe', 'Spa tub'].map(item => (
                                                    <label key={item} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                        <input type="checkbox" checked={currentRoomData.bathroomItems?.includes(item) || false}
                                                            onChange={() => {
                                                                const items = currentRoomData.bathroomItems || []
                                                                updateRoomField('bathroomItems', items.includes(item)
                                                                    ? items.filter(i => i !== item)
                                                                    : [...items, item])
                                                            }}
                                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                                        <span className="text-sm text-gray-800">{item}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="lg:w-1/2 space-y-8">
                                    {/* Number of Rooms */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-900 mb-3">How many rooms of this type do you have?</label>
                                        <input type="number" min="1" value={currentRoomData.numberOfRooms || 1}
                                            onChange={(e) => updateRoomField('numberOfRooms', parseInt(e.target.value))}
                                            className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    </div>

                                    {/* Bed Types */}
                                    <div>
                                        <label className="block text-base font-semibold text-gray-900 mb-3">What beds are available in this room?</label>
                                        <div className="space-y-3">
                                            {bedTypesList.map(bed => (
                                                <div key={bed.id} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">🛏️</span>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{bed.label}</p>
                                                            <p className="text-sm text-gray-600">{bed.size}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button type="button" onClick={() => updateBedType(bed.id, Math.max(0, getBedQuantity(bed.id) - 1))}
                                                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 font-bold">-</button>
                                                        <span className="w-8 text-center font-semibold">{getBedQuantity(bed.id)}</span>
                                                        <button type="button" onClick={() => updateBedType(bed.id, getBedQuantity(bed.id) + 1)}
                                                            className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 font-bold">+</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" className="mt-3 text-blue-600 text-sm font-semibold hover:underline">+ Fewer bed options</button>
                                    </div>

                                    {/* Room Details Section */}
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Room details</h3>

                                        {/* General amenities */}
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-3">General amenities</h4>
                                            <div className="grid grid-cols-2 gap-1">
                                                {['Clothes rack', 'Flat-screen TV', 'Air conditioning', 'Linens', 'Desk', 'Wake-up service', 'Wardrobe or closet', 'Heating', 'Fan', 'Safe', 'Towels/Sheets (extra fee)', 'Entire unit located on ground floor'].map(item => (
                                                    <label key={item} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                        <input type="checkbox" checked={currentRoomData.roomFacilities?.includes(item) || false}
                                                            onChange={() => toggleRoomFacility(item)}
                                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                                        <span className="text-sm text-gray-800">{item}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <button type="button" className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">+ Add More</button>
                                        </div>

                                        {/* Outdoors and views */}
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-3">Outdoors and views</h4>
                                            <div className="grid grid-cols-2 gap-1">
                                                {['Balcony', 'Terrace', 'View'].map(item => (
                                                    <label key={item} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                        <input type="checkbox" checked={currentRoomData.outdoorViews?.includes(item) || false}
                                                            onChange={() => {
                                                                const items = currentRoomData.outdoorViews || []
                                                                updateRoomField('outdoorViews', items.includes(item)
                                                                    ? items.filter(i => i !== item)
                                                                    : [...items, item])
                                                            }}
                                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                                        <span className="text-sm text-gray-800">{item}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <button type="button" className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">+ Add More</button>
                                        </div>

                                        {/* Food and drink */}
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-3">Food and drink</h4>
                                            <div className="grid grid-cols-2 gap-1">
                                                {['Electric kettle', 'Tea/Coffee maker', 'Dining area', 'Dining table', 'Minibar'].map(item => (
                                                    <label key={item} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                        <input type="checkbox" checked={currentRoomData.foodDrink?.includes(item) || false}
                                                            onChange={() => {
                                                                const items = currentRoomData.foodDrink || []
                                                                updateRoomField('foodDrink', items.includes(item)
                                                                    ? items.filter(i => i !== item)
                                                                    : [...items, item])
                                                            }}
                                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                                        <span className="text-sm text-gray-800">{item}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <button type="button" className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">+ Add More</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Price Per Night */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Set the price per night for this room</h3>
                                <div>
                                    <label className="block text-base font-semibold text-gray-900 mb-3">How much do you want to charge per night?</label>
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-2">Price guests pay</p>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">INR</span>
                                                <input type="number" min="0" value={currentRoomData.pricePerNight}
                                                    onChange={(e) => updateRoomField('pricePerNight', e.target.value)}
                                                    className="w-full pl-16 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                                                    placeholder="0" />
                                            </div>
                                            <select className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-white">
                                                <option>%</option>
                                            </select>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">Including taxes, commission, and fees</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                            <button type="button" onClick={saveRoom}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                {editingRoomIndex !== null ? 'Save Data' : '+ Add'}
                            </button>
                            <button type="button" onClick={closeRoomModal}
                                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Facility Modal */}
            {isFacilityModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                        {/* Close button */}
                        <button
                            onClick={closeFacilityModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Custom Facility</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Add a facility that's not in the default list. It will be saved to the database for future use.
                        </p>

                        {/* Input Field */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Facility Name *
                            </label>
                            <input
                                type="text"
                                value={newFacilityName}
                                onChange={(e) => setNewFacilityName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomFacility()}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Game Room, Library, etc."
                                autoFocus
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={closeFacilityModal}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                disabled={isSavingFacility}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddCustomFacility}
                                disabled={!newFacilityName.trim() || isSavingFacility}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {isSavingFacility ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Facility'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes checkmark {
                    0 % { transform: scale(0) rotate(- 45deg); opacity: 0; }
                50% {transform: scale(1.2) rotate(5deg); }
                100% {transform: scale(1) rotate(0deg); opacity: 1; }
        }
                .animate-checkmark {animation: checkmark 0.3s ease-in-out; }
      `}</style>
        </div>
    )
}

export default PropertyRegistration