"use client"
import React, { useState, useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'

const PropertyRegistration = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
    const [editingRoomIndex, setEditingRoomIndex] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [allowReload, setAllowReload] = useState(false) 
    const [submitStatus, setSubmitStatus] = useState(null)
    const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false)
    const [customFacilities, setCustomFacilities] = useState([])
    const [newFacilityName, setNewFacilityName] = useState('')
    const [isSavingFacility, setIsSavingFacility] = useState(false)
    const [isBreakfastModalOpen, setIsBreakfastModalOpen] = useState(false)
    const [customBreakfastTypes, setCustomBreakfastTypes] = useState([])
    const [newBreakfastType, setNewBreakfastType] = useState('')
    const [isSavingBreakfast, setIsSavingBreakfast] = useState(false)

    // Room Amenities States
    const [isBathroomModalOpen, setIsBathroomModalOpen] = useState(false)
    const [customBathroomItems, setCustomBathroomItems] = useState([])
    const [newBathroomItem, setNewBathroomItem] = useState('')
    const [isSavingBathroom, setIsSavingBathroom] = useState(false)

    const [isGeneralAmenityModalOpen, setIsGeneralAmenityModalOpen] = useState(false)
    const [customGeneralAmenities, setCustomGeneralAmenities] = useState([])
    const [newGeneralAmenity, setNewGeneralAmenity] = useState('')
    const [isSavingGeneralAmenity, setIsSavingGeneralAmenity] = useState(false)

    const [isOutdoorModalOpen, setIsOutdoorModalOpen] = useState(false)
    const [customOutdoorItems, setCustomOutdoorItems] = useState([])
    const [newOutdoorItem, setNewOutdoorItem] = useState('')
    const [isSavingOutdoor, setIsSavingOutdoor] = useState(false)

    const [isFoodDrinkModalOpen, setIsFoodDrinkModalOpen] = useState(false)
    const [customFoodDrinkItems, setCustomFoodDrinkItems] = useState([])
    const [newFoodDrinkItem, setNewFoodDrinkItem] = useState('')
    const [isSavingFoodDrink, setIsSavingFoodDrink] = useState(false)

    // Bed types visibility
    const [showAllBeds, setShowAllBeds] = useState(false)

    // Photo upload states
    const [selectedRoomForPhotos, setSelectedRoomForPhotos] = useState(null)
    const [showRoomPhotoDetail, setShowRoomPhotoDetail] = useState(false)
    const [roomImages, setRoomImages] = useState({}) // { roomIndex: { primary: url, room: [urls], bathroom: [urls] } }
    const [propertyImages, setPropertyImages] = useState({}) // { primary: url, exterior: url, etc. }
    const [photoSectionView, setPhotoSectionView] = useState('selection') // 'selection', 'rooms', 'property'

    // Document upload states for Step 13
    const [documents, setDocuments] = useState({
        ownerPanDoc: null,      // { url, key, loading }
        propertyPanDoc: null,   // { url, key, loading }
        gstDoc: null,           // { url, key, loading }
        bankChequeDoc: null     // { url, key, loading }
    })
    const [profilePhoto, setProfilePhoto] = useState(null) // { url, key, loading }

    const { register, handleSubmit, watch, control, setValue, formState: { errors }, trigger } = useForm({
        mode: 'onChange', // Enable real-time validation
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
            alternativeBookingType: null,
            rooms: []
        }
    })
    const { fields: roomFields, append: appendRoom, remove: removeRoom, update: updateRoom } = useFieldArray({
        control,
        name: "rooms"
    })

    const [currentRoomData, setCurrentRoomData] = useState({
        roomType: '',
        bedTypes: [],
        roomSize: '',
        smokingAllowed: false,
        privateBathroom: null, // null by default, so bathroom items are hidden
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
    const [furnishingStatus, setFurnishingStatus] = useState(null)

    // Apartment-specific fields
    const [listedWebsites, setListedWebsites] = useState([])
    const [customWebsite, setCustomWebsite] = useState('')
    const [airbnbImportLink, setAirbnbImportLink] = useState('')

    // Home-specific: How many apartments are you listing?
    const [homeListingType, setHomeListingType] = useState('') // 'one' or 'multiple'

    // Alternative-specific fields
    const [alternativeSubtype, setAlternativeSubtype] = useState('') // Selected subtype
    const [alternativeBookingType, setAlternativeBookingType] = useState('') // 'entire-place' or 'private-room'

    // Fetch custom facilities and breakfast types on component mount
    useEffect(() => {
        const fetchCustomData = async () => {
            try {
                // Fetch all APIs in parallel using Promise.all
                const [
                    facilitiesResponse,
                    breakfastResponse,
                    bathroomResponse,
                    generalResponse,
                    outdoorResponse,
                    foodDrinkResponse
                ] = await Promise.all([
                    fetch('/api/customFacilities'),
                    fetch('/api/customBreakfastTypes'),
                    fetch('/api/customRoomAmenities/bathroom'),
                    fetch('/api/customRoomAmenities/general'),
                    fetch('/api/customRoomAmenities/outdoor'),
                    fetch('/api/customRoomAmenities/fooddrink')
                ])

                // Process facilities
                if (facilitiesResponse.ok) {
                    const facilitiesData = await facilitiesResponse.json()
                    setCustomFacilities(facilitiesData.facilities || [])
                }

                // Process breakfast types
                if (breakfastResponse.ok) {
                    const breakfastData = await breakfastResponse.json()
                    setCustomBreakfastTypes(breakfastData.breakfastTypes || [])
                }

                // Process bathroom items
                if (bathroomResponse.ok) {
                    const bathroomData = await bathroomResponse.json()
                    setCustomBathroomItems(bathroomData.items || [])
                }

                // Process general amenities
                if (generalResponse.ok) {
                    const generalData = await generalResponse.json()
                    setCustomGeneralAmenities(generalData.items || [])
                }

                // Process outdoor items
                if (outdoorResponse.ok) {
                    const outdoorData = await outdoorResponse.json()
                    setCustomOutdoorItems(outdoorData.items || [])
                }

                // Process food/drink items
                if (foodDrinkResponse.ok) {
                    const foodDrinkData = await foodDrinkResponse.json()
                    setCustomFoodDrinkItems(foodDrinkData.items || [])
                }
            } catch (error) {
                console.error('Error fetching custom data:', error)
            }
        }
        fetchCustomData()
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
            label: 'Hotel',
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
            { id: '1bhk', label: '1 BHK (1 Bedroom, Hall, Kitchen)', description: 'A "ready-to-live" space including a bed, sofa, fridge, and TV; ideal for moving in with just a suitcase.', hasFurnishing: true },
            { id: '2bhk', label: '2 BHK (2 Bedrooms, Hall, Kitchen)', description: 'A complete home setup for two people or a small family, removing the need to buy furniture for multiple rooms.', hasFurnishing: true },
            { id: '3bhk', label: '3 BHK (3 Bedrooms, Hall, Kitchen)', description: 'High-end convenience in a large space; every bedroom and the living area is fully equipped with designer furniture.', hasFurnishing: true },
            { id: '4bhk', label: '4 BHK (4 Bedrooms, Hall, Kitchen)', description: 'The height of luxury and ease; a sprawling, professionally decorated home where every detail is pre-arranged.', hasFurnishing: true },
            { id: 'studio', label: 'Studio Apartment', description: 'A single open-plan room combining sleep, work, and cooking; the ultimate choice for minimalist, solo city living.', hasFurnishing: false },
            { id: 'penthouse', label: 'Penthouse', description: 'A premium top-floor residence offering the best views, extra privacy, and often a private terrace or higher ceilings.', hasFurnishing: false }
        ],
        homes: [
            { id: 'single-family-detached', label: 'Single-Family Detached', description: 'A standalone house that shares no walls with neighbors. It offers the most privacy and usually includes a private yard.' },
            { id: 'semi-detached-duplex', label: 'Semi-Detached (Duplex)', description: 'Two houses joined together by a single common wall. This is often more affordable than a fully detached home while still offering a yard.' },
            { id: 'townhouse-row-house', label: 'Townhouse (Row House)', description: 'Multiple houses lined up in a row, sharing side walls with neighbors on both sides (unless it\'s an end unit). These are usually multi-story.' },
            { id: 'multi-family-home', label: 'Multi-Family Home', description: 'A building designed to house multiple separate families in distinct units (like a triplex or fourplex). Often used as investment properties.' },
            { id: 'tiny-home', label: 'Tiny Home', description: 'Typically under 400 square feet. These focus on minimalism and efficiency, and can be on wheels or a permanent foundation.' },
            { id: 'paying-guest-home', label: 'Paying Guest Home (Row House)', description: 'Single Room in an Owner-Occupied home. You have your own private bedroom, but you share the "heart of the home" (kitchen/laundry) with the owner.' },
            { id: 'owner-occupied-multi-shared', label: 'Owner-Occupied Multi-Shared Rooms', description: 'This is when a homeowner lives in their primary residence while renting out multiple rooms to separate individuals, and each tenant has an individual agreement for their specific room.' },
            { id: 'home-family-free', label: 'Home With Family-Free Options', description: 'Moving away from the traditional nuclear family model and toward Solo Living. Managed by a Landlord you get a private room/bath but share high-end kitchens and lounges.' },
            { id: 'corporate-housing', label: 'Corporate Housing', description: 'Fully furnished apartments designed for 30-day stays. Great if you are in a transition period and don\'t want to buy furniture. Maximum privacy and storage.' }
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
            {
                id: 'floating-stays',
                label: 'Floating Stays (Boats & Houseboats)',
                description: 'These properties offer a literal "on-the-water" experience, ranging from rustic sailboats to stationary luxury houseboats.',
                subtypes: [
                    { id: 'semi-furnished', label: 'Semi-Furnished' },
                    { id: 'fully-furnished', label: 'Fully Furnished' }
                ]
            },
            {
                id: 'traditional-campgrounds',
                label: 'Traditional Campgrounds',
                description: 'These properties emphasize communal living, campfires, and immediate access to hiking trails and national parks.',
                subtypes: [
                    { id: 'sharing-single', label: 'Sharing Basis Single Accommodation' },
                    { id: 'sharing-multiple', label: 'Sharing Basis Multiple Accommodation' }
                ]
            },
            {
                id: 'glamping-luxury-tents',
                label: 'Glamping & Luxury Tents',
                description: 'These properties feature semi-permanent structures—such as safari tents, yurts, or tipis—outfitted with real beds, fine linens, and often private bathrooms.',
                subtypes: [
                    { id: 'sharing-single', label: 'Sharing Basis Single Accommodation' },
                    { id: 'sharing-multiple', label: 'Sharing Basis Multiple Accommodation' }
                ]
            },
            {
                id: 'unique-architectural',
                label: 'Unique Architectural Structures',
                description: 'They appeal to whimsical travelers and design enthusiasts who want their accommodation to be the highlight of their trip.',
                subtypes: [
                    { id: 'sharing-basis', label: 'Sharing Basis Accommodation' },
                    { id: 'private', label: 'Private Accommodation' }
                ]
            }
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

    // Get the label of the selected category
    const getSelectedCategoryLabel = () => {
        if (!selectedCategory) return 'property'
        const category = propertyCategories.find(cat => cat.id === selectedCategory)
        return category ? category.label.toLowerCase() : 'property'
    }

    // Helper function to get actual step number based on category
    // Apartments have 2 extra steps (4A and 4B) after step 4
    const getActualStep = (logicalStep) => {
        if (selectedCategory === 'apartment' && logicalStep >= 5) {
            return logicalStep + 2 // Add 2 for the apartment-specific steps
        }
        return logicalStep
    }


    const roomTypesList = ['Studio', 'Suite', 'Twin/Double', 'Triple/Quad', 'Family', 'Dorm', 'Shared Room', 'Bunk Room']
    const ownershipTypes = ['Primary Property Ownership', 'Freehold', 'Leasehold', 'Strata Title', 'Partnership', 'Fractional Ownership', 'Joint Ownership (Co-ownership)']
    const languages = [
        'English', 'Hindi', 'Arabic', 'Bengali', 'Bulgarian', 'Catalan', 'Chinese', 'Croatian',
        'Czech', 'Danish', 'Dutch', 'Finnish', 'French', 'German', 'Greek', 'Hebrew', 'Hungarian',
        'Indonesian', 'Italian', 'Japanese', 'Korean', 'Malay', 'Marathi', 'Norwegian', 'Persian',
        'Polish', 'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Serbian', 'Slovak', 'Slovenian',
        'Spanish', 'Swahili', 'Swedish', 'Tamil', 'Telugu', 'Thai', 'Turkish', 'Ukrainian',
        'Urdu', 'Vietnamese', 'Welsh', 'Xhosa', 'Yoruba', 'Zulu', 'Nepali', 'Sinhala',
        'Kannada', 'Gujarati', 'Odia', 'Assamese', 'Burmese', 'Khmer'
    ];

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


    // Browser refresh protection
    useEffect(() => {
        const hasFormData = selectedCategory || watch('propertyName') || roomFields.length > 0

        const handleBeforeUnload = (e) => {
            // Don't show warning if reload is allowed (after successful submission)
            if (allowReload) {
                return
            }

            if (hasFormData && currentStep > 1 && !isSubmitting) {
                e.preventDefault()
                e.returnValue = '' // Chrome requires returnValue to be set
                return ''
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [selectedCategory, watch, roomFields, currentStep, isSubmitting, allowReload])

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        setSubmitStatus(null)

        try {
            // Prepare data with correct field mapping
            const formData = {
                // Step 1-4
                category: selectedCategory,
                propertyType: selectedPropertyType,
                customPropertyType: customPropertyType,
                furnishingStatus: furnishingStatus,
                listedWebsites: listedWebsites,
                customWebsite: customWebsite,
                airbnbImportLink: airbnbImportLink,
                homeListingType: homeListingType,
                alternativeSubtype: alternativeSubtype,
                alternativeBookingType: alternativeBookingType,
                numberOfRooms: numberOfRooms,
                numberOfFloors: numberOfFloors,
                propertyConfirmation: propertyConfirmation,

                // Step 5 - Location
                apartmentOrFloor: data.apartmentOrFloor,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                pinCode: data.pinCode,
                googleLocationCode: data.googleLocationCode,
                googleBusinessProfileCode: data.googleBusinessProfileCode,

                // Step 6 - Property Details
                propertyName: data.propertyName,
                starRating: data.starRating,
                isChainProperty: data.isChainProperty,
                chainName: data.chainName,
                ownershipType: data.ownershipType,
                facilities: data.facilities,

                // Step 7 - Services
                servesBreakfast: data.servesBreakfast,
                breakfastIncluded: data.breakfastIncluded,
                breakfastPrice: data.breakfastPrice ? parseFloat(data.breakfastPrice) : undefined,
                breakfastTypes: data.breakfastTypes,
                parkingAvailable: data.parkingAvailable,
                parkingCost: data.parkingCost ? parseFloat(data.parkingCost) : undefined,
                parkingCostPeriod: data.parkingCostPeriod,
                parkingReservation: data.parkingReservation,
                parkingLocation: data.parkingLocation,
                parkingType: data.parkingType,

                // Step 8 - Languages (combine languages and additionalLanguages)
                languagesSpoken: [
                    ...(data.languages || []),
                    ...(data.additionalLanguages || [])
                ],

                // Step 9 - House Rules
                checkInFrom: data.checkInFrom,
                checkInUntil: data.checkInUntil,
                checkOutFrom: data.checkOutFrom,
                checkOutUntil: data.checkOutUntil,
                allowChildren: data.allowChildren,
                allowPets: data.allowPets,
                petCharges: data.petCharges ? parseFloat(data.petCharges) : undefined,

                // Step 10 - Rooms
                rooms: data.rooms,

                // Step 11 - Room Images (Transform to match model)
                roomImages: Object.entries(roomImages).map(([roomIndex, photos]) => ({
                    roomIndex: parseInt(roomIndex),
                    primaryImage: photos.primary ? [{
                        url: photos.primary.url || photos.primary,
                        key: photos.primary.key || ''
                    }] : [],
                    roomImage: Array.isArray(photos.room) ? photos.room.map(p => ({
                        url: p.url || p,
                        key: p.key || ''
                    })) : [],
                    bathroomImage: Array.isArray(photos.bathroom) ? photos.bathroom.map(p => ({
                        url: p.url || p,
                        key: p.key || ''
                    })) : []
                })),

                // Step 12 - Property Images
                propertyImages: {
                    primary: propertyImages.primary ? (Array.isArray(propertyImages.primary) ? propertyImages.primary.map(p => ({ url: p.url || p, key: p.key || '' })) : [{ url: propertyImages.primary.url || propertyImages.primary, key: propertyImages.primary.key || '' }]) : [],
                    exterior: propertyImages.exterior ? (Array.isArray(propertyImages.exterior) ? propertyImages.exterior.map(p => ({ url: p.url || p, key: p.key || '' })) : [{ url: propertyImages.exterior.url || propertyImages.exterior, key: propertyImages.exterior.key || '' }]) : [],
                    interior: propertyImages.interior ? (Array.isArray(propertyImages.interior) ? propertyImages.interior.map(p => ({ url: p.url || p, key: p.key || '' })) : [{ url: propertyImages.interior.url || propertyImages.interior, key: propertyImages.interior.key || '' }]) : [],
                    reception: propertyImages.reception ? (Array.isArray(propertyImages.reception) ? propertyImages.reception.map(p => ({ url: p.url || p, key: p.key || '' })) : [{ url: propertyImages.reception.url || propertyImages.reception, key: propertyImages.reception.key || '' }]) : [],
                    restaurant: propertyImages.restaurant ? (Array.isArray(propertyImages.restaurant) ? propertyImages.restaurant.map(p => ({ url: p.url || p, key: p.key || '' })) : [{ url: propertyImages.restaurant.url || propertyImages.restaurant, key: propertyImages.restaurant.key || '' }]) : [],
                    parking: propertyImages.parking ? (Array.isArray(propertyImages.parking) ? propertyImages.parking.map(p => ({ url: p.url || p, key: p.key || '' })) : [{ url: propertyImages.parking.url || propertyImages.parking, key: propertyImages.parking.key || '' }]) : [],
                    other: propertyImages.other ? (Array.isArray(propertyImages.other) ? propertyImages.other.map(p => ({ url: p.url || p, key: p.key || '' })) : [{ url: propertyImages.other.url || propertyImages.other, key: propertyImages.other.key || '' }]) : []
                },

                // Step 13 - Personal Info (Fix key mapping)
                ownerName: data.ownerName,
                ownerEmail: data.ownerEmail,
                ownerContact: data.ownerContact,
                panNumber: data.panNumber,
                panDocument: documents.ownerPanDoc ? { url: documents.ownerPanDoc.url, key: documents.ownerPanDoc.key } : null,
                aadhaarNumber: data.aadhaarNumber,
                profilePhoto: profilePhoto ? { url: profilePhoto.url, key: profilePhoto.key } : null,

                officialPropertyName: data.officialPropertyName,
                officialEmail: data.officialEmail,
                officialContact: data.officialContact,
                alternativeContact: data.alternativeContact,
                propertyPanNumber: data.propertyPanNumber,
                propertyPanDocument: documents.propertyPanDoc ? { url: documents.propertyPanDoc.url, key: documents.propertyPanDoc.key } : null,
                gstNumber: data.gstNumber,
                gstDocument: documents.gstDoc ? { url: documents.gstDoc.url, key: documents.gstDoc.key } : null,

                accountNumber: data.accountNumber,
                bankName: data.bankName,
                accountHolderName: data.accountHolderName,
                ifscCode: data.ifscCode,
                bankAddress: data.bankAddress,
                cancelledCheque: documents.bankChequeDoc ? { url: documents.bankChequeDoc.url, key: documents.bankChequeDoc.key } : null
            }

            const response = await fetch('/api/addPropertyRegistration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (response.ok && result.success) {
                // Show success toast
                toast.success('Property registered successfully!')

                setSubmitStatus({
                    type: 'success',
                    message: result.message || 'Property registration submitted successfully!',
                    propertyId: result.data?.id
                })

                // Allow reload and then reload after 2 seconds
                setAllowReload(true)
                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            } else {
                // Show error toast
                toast.error(result.error || 'Failed to submit property registration')

                setSubmitStatus({
                    type: 'error',
                    message: result.error || 'Failed to submit property registration',
                    details: result.details
                })
            }
        } catch (error) {
            console.error('Submission error:', error)

            // Show error toast
            toast.error('Network error. Please check your connection and try again.')

            setSubmitStatus({
                type: 'error',
                message: 'Network error. Please check your connection and try again.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleContinue = async () => {
        // Step 1: Category selection
        if (currentStep === 1) {
            const isValid = await trigger('category')
            if (!isValid) {
                toast.error('Please select a property category')
                return
            }
            setCurrentStep(2)
        }
        // Step 2: Property type selection
        else if (currentStep === 2) {
            if (!selectedPropertyType && !customPropertyType) {
                toast.error('Please select a property type')
                return
            }
            setCurrentStep(3)
        }
        // Step 3: Property size
        else if (currentStep === 3) {
            setCurrentStep(4)
        }
        // Step 4: Property confirmation
        else if (currentStep === 4) {
            const isValid = await trigger('propertyConfirmation')
            if (!isValid || !propertyConfirmation) {
                toast.error('Please confirm if this is your property type')
                return
            }
            if (propertyConfirmation === 'no') setCurrentStep(2)
            else if (propertyConfirmation === 'yes') {
                // For non-hotels (apartments, homes, alternative): go to step 5
                // For hotels: skip to step 7
                setCurrentStep(selectedCategory === 'hotel' ? 7 : 5)
            }
        }
        // Step 5: Listing websites (all except hotels)
        else if (currentStep === 5) {
            setCurrentStep(6)
        }
        // Step 6: Property name (all except hotels)
        else if (currentStep === 6) {
            setCurrentStep(7)
        }
        // Step 7: Location
        else if (currentStep === 7) {
            const isValid = await trigger(['addressLine1', 'city', 'pinCode'])
            if (!isValid) {
                toast.error('Please fill in all required location fields')
                return
            }
            setCurrentStep(8)
        }
        // Step 8: Property details
        else if (currentStep === 8) {
            const isValid = await trigger(['propertyName', 'starRating'])
            if (!isValid) {
                toast.error('Please fill in all required property details')
                return
            }
            setCurrentStep(9)
        }
        // Step 9: Services
        else if (currentStep === 9) {
            setCurrentStep(10)
        }
        // Step 10: Languages
        else if (currentStep === 10) {
            setCurrentStep(11)
        }
        // Step 11: House Rules
        else if (currentStep === 11) {
            const isValid = await trigger(['checkInFrom', 'checkInUntil', 'checkOutFrom', 'checkOutUntil'])
            if (!isValid) {
                toast.error('Please fill in all check-in and check-out times')
                return
            }
            setCurrentStep(12)
        }
        // Step 12: Overview page - Submit form
        else if (currentStep === 12) {
            handleSubmit(onSubmit)()
        }
        // Step 13: Rooms - Return to overview
        else if (currentStep === 13) {
            setCurrentStep(12)
        }
        // Step 14: Photos - Return to overview
        else if (currentStep === 14) {
            setCurrentStep(12)
        }
        // Step 15: Personal Info - Return to overview
        else if (currentStep === 15) {
            setCurrentStep(12)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            // From step 7, skip steps 5-6 for hotels
            if (currentStep === 7 && selectedCategory === 'hotel') {
                setCurrentStep(4)
            }
            // From steps 13, 14, 15 (sub-steps), go back to step 12 (overview)
            else if (currentStep === 13 || currentStep === 14 || currentStep === 15) {
                setCurrentStep(12)
            }
            // Normal back navigation
            else {
                setCurrentStep(currentStep - 1)
            }
        }
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

    // const deleteCustomFacility = async (facilityId) => {
    //     try {
    //         const response = await fetch(`/api/customFacilities?id=${facilityId}`, {
    //             method: 'DELETE'
    //         })

    //         if (response.ok) {
    //             setCustomFacilities(customFacilities.filter(f => f.id !== facilityId))
    //         } else {
    //             alert('Failed to delete facility')
    //         }
    //     } catch (error) {
    //         console.error('Error deleting facility:', error)
    //         alert('Error deleting facility')
    //     }
    // }

    // Custom Breakfast Types Modal Handlers
    const openBreakfastModal = () => setIsBreakfastModalOpen(true)
    const closeBreakfastModal = () => {
        setIsBreakfastModalOpen(false)
        setNewBreakfastType('')
    }

    const handleAddCustomBreakfast = async () => {
        if (!newBreakfastType.trim()) return

        setIsSavingBreakfast(true)
        try {
            const response = await fetch('/api/customBreakfastTypes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newBreakfastType.trim() })
            })

            if (response.ok) {
                const data = await response.json()
                setCustomBreakfastTypes([...customBreakfastTypes, data.breakfastType])
                setNewBreakfastType('')
                closeBreakfastModal()
            } else {
                alert('Failed to add custom breakfast type')
            }
        } catch (error) {
            console.error('Error adding custom breakfast type:', error)
            alert('Error adding custom breakfast type')
        } finally {
            setIsSavingBreakfast(false)
        }
    }

    // const deleteCustomBreakfast = async (breakfastId) => {
    //     try {
    //         const response = await fetch(`/api/customBreakfastTypes?id=${breakfastId}`, {
    //             method: 'DELETE'
    //         })

    //         if (response.ok) {
    //             setCustomBreakfastTypes(customBreakfastTypes.filter(b => b.id !== breakfastId))
    //         } else {
    //             alert('Failed to delete breakfast type')
    //         }
    //     } catch (error) {
    //         console.error('Error deleting breakfast type:', error)
    //         alert('Error deleting breakfast type')
    //     }
    // }

    // Room Amenities Modal Handlers
    // Bathroom Items
    const openBathroomModal = () => setIsBathroomModalOpen(true)
    const closeBathroomModal = () => {
        setIsBathroomModalOpen(false)
        setNewBathroomItem('')
    }
    const handleAddBathroomItem = async () => {
        if (!newBathroomItem.trim()) return
        setIsSavingBathroom(true)
        try {
            const response = await fetch('/api/customRoomAmenities/bathroom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newBathroomItem.trim() })
            })
            if (response.ok) {
                const data = await response.json()
                setCustomBathroomItems([...customBathroomItems, data.item])
                closeBathroomModal()
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsSavingBathroom(false)
        }
    }

    // General Amenities
    const openGeneralAmenityModal = () => setIsGeneralAmenityModalOpen(true)
    const closeGeneralAmenityModal = () => {
        setIsGeneralAmenityModalOpen(false)
        setNewGeneralAmenity('')
    }
    const handleAddGeneralAmenity = async () => {
        if (!newGeneralAmenity.trim()) return
        setIsSavingGeneralAmenity(true)
        try {
            const response = await fetch('/api/customRoomAmenities/general', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newGeneralAmenity.trim() })
            })
            if (response.ok) {
                const data = await response.json()
                setCustomGeneralAmenities([...customGeneralAmenities, data.item])
                closeGeneralAmenityModal()
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsSavingGeneralAmenity(false)
        }
    }

    // Outdoors and Views
    const openOutdoorModal = () => setIsOutdoorModalOpen(true)
    const closeOutdoorModal = () => {
        setIsOutdoorModalOpen(false)
        setNewOutdoorItem('')
    }
    const handleAddOutdoorItem = async () => {
        if (!newOutdoorItem.trim()) return
        setIsSavingOutdoor(true)
        try {
            const response = await fetch('/api/customRoomAmenities/outdoor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newOutdoorItem.trim() })
            })
            if (response.ok) {
                const data = await response.json()
                setCustomOutdoorItems([...customOutdoorItems, data.item])
                closeOutdoorModal()
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsSavingOutdoor(false)
        }
    }

    // Food and Drink
    const openFoodDrinkModal = () => setIsFoodDrinkModalOpen(true)
    const closeFoodDrinkModal = () => {
        setIsFoodDrinkModalOpen(false)
        setNewFoodDrinkItem('')
    }
    const handleAddFoodDrinkItem = async () => {
        if (!newFoodDrinkItem.trim()) return
        setIsSavingFoodDrink(true)
        try {
            const response = await fetch('/api/customRoomAmenities/fooddrink', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newFoodDrinkItem.trim() })
            })
            if (response.ok) {
                const data = await response.json()
                setCustomFoodDrinkItems([...customFoodDrinkItems, data.item])
                closeFoodDrinkModal()
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsSavingFoodDrink(false)
        }
    }

    // Photo Upload Handlers
    const openRoomPhotoDetail = (roomIndex) => {
        setSelectedRoomForPhotos(roomIndex)
        setShowRoomPhotoDetail(true)
    }

    const closeRoomPhotoDetail = () => {
        setSelectedRoomForPhotos(null)
        setShowRoomPhotoDetail(false)
    }

    const handleRoomImageUpload = async (roomIndex, imageType, files) => {
        const fileArray = files instanceof FileList ? Array.from(files) : [files]
        if (imageType === 'primary') {
            // Primary image: single image only
            const file = fileArray[0]
            // Set loading state
            setRoomImages(prev => ({
                ...prev,
                [roomIndex]: {
                    ...prev[roomIndex],
                    primary: { url: URL.createObjectURL(file), loading: true }
                }
            }))
            // Upload to Cloudinary
            const formDataUpload = new FormData()
            formDataUpload.append('file', file)
            try {
                const res = await fetch('/api/cloudinary', {
                    method: 'POST',
                    body: formDataUpload
                })
                const data = await res.json()
                if (res.ok && data.url) {
                    setRoomImages(prev => ({
                        ...prev,
                        [roomIndex]: {
                            ...prev[roomIndex],
                            primary: { url: data.url, key: data.key || '', loading: false }
                        }
                    }))
                } else {
                    console.error('Cloudinary upload failed:', data.error || 'Unknown error')
                    setRoomImages(prev => ({
                        ...prev,
                        [roomIndex]: {
                            ...prev[roomIndex],
                            primary: null
                        }
                    }))
                }
            } catch (err) {
                console.error('Cloudinary upload error:', err.message)
                setRoomImages(prev => ({
                    ...prev,
                    [roomIndex]: {
                        ...prev[roomIndex],
                        primary: null
                    }
                }))
            }
        } else {
            // Room and Bathroom: multiple images
            const newImages = fileArray.map(file => ({
                file,
                url: URL.createObjectURL(file),
                key: '',
                loading: true
            }))
            // Add new images with loading state
            setRoomImages(prev => ({
                ...prev,
                [roomIndex]: {
                    ...prev[roomIndex],
                    [imageType]: [...(prev[roomIndex]?.[imageType] || []), ...newImages]
                }
            }))
            // Upload each file to Cloudinary
            for (let i = 0; i < fileArray.length; i++) {
                const file = fileArray[i]
                const formDataUpload = new FormData()
                formDataUpload.append('file', file)
                try {
                    const res = await fetch('/api/cloudinary', {
                        method: 'POST',
                        body: formDataUpload
                    })
                    const data = await res.json()
                    if (res.ok && data.url) {
                        setRoomImages(prev => {
                            const currentImages = [...(prev[roomIndex]?.[imageType] || [])]
                            const index = currentImages.findIndex(img => img.file === file)
                            if (index !== -1) {
                                currentImages[index] = {
                                    ...currentImages[index],
                                    url: data.url,
                                    key: data.key || '',
                                    loading: false
                                }
                            }
                            return {
                                ...prev,
                                [roomIndex]: {
                                    ...prev[roomIndex],
                                    [imageType]: currentImages
                                }
                            }
                        })
                    }
                } catch (err) {
                    console.error('Error uploading image:', err)
                    // Remove the failed upload
                    setRoomImages(prev => ({
                        ...prev,
                        [roomIndex]: {
                            ...prev[roomIndex],
                            [imageType]: prev[roomIndex]?.[imageType]?.filter(img => img.file !== file) || []
                        }
                    }))
                }
            }
        }
    }
    const handleRemoveRoomImage = (roomIndex, imageType, imageData) => {
        if (imageType === 'primary') {
            // Remove primary image
            setRoomImages(prev => ({
                ...prev,
                [roomIndex]: {
                    ...prev[roomIndex],
                    primary: null
                }
            }))
        } else {
            // Remove from room or bathroom array
            setRoomImages(prev => ({
                ...prev,
                [roomIndex]: {
                    ...prev[roomIndex],
                    [imageType]: prev[roomIndex]?.[imageType]?.filter(img => img.url !== imageData.url) || []
                }
            }))
        }
    }
    const handlePropertyImageUpload = async (imageType, files) => {
        const fileArray = files instanceof FileList ? Array.from(files) : [files]
        if (imageType === 'primary') {
            // Primary image: single image only
            const file = fileArray[0]
            // Set loading state
            setPropertyImages(prev => ({
                ...prev,
                primary: { url: URL.createObjectURL(file), loading: true }
            }))
            // Upload to Cloudinary
            const formDataUpload = new FormData()
            formDataUpload.append('file', file)
            try {
                const res = await fetch('/api/cloudinary', {
                    method: 'POST',
                    body: formDataUpload
                })
                const data = await res.json()
                if (res.ok && data.url) {
                    setPropertyImages(prev => ({
                        ...prev,
                        primary: { url: data.url, key: data.key || '', loading: false }
                    }))
                } else {
                    console.error('Cloudinary upload failed:', data.error || 'Unknown error')
                    setPropertyImages(prev => ({
                        ...prev,
                        primary: null
                    }))
                }
            } catch (err) {
                console.error('Cloudinary upload error:', err.message)
                setPropertyImages(prev => ({
                    ...prev,
                    primary: null
                }))
            }
        } else {
            // Other categories: multiple images
            const newImages = fileArray.map(file => ({
                file,
                url: URL.createObjectURL(file),
                key: '',
                loading: true
            }))
            // Add new images with loading state
            setPropertyImages(prev => ({
                ...prev,
                [imageType]: [...(prev[imageType] || []), ...newImages]
            }))
            // Upload each file to Cloudinary
            for (let i = 0; i < fileArray.length; i++) {
                const file = fileArray[i]
                const formDataUpload = new FormData()
                formDataUpload.append('file', file)
                try {
                    const res = await fetch('/api/cloudinary', {
                        method: 'POST',
                        body: formDataUpload
                    })
                    const data = await res.json()
                    if (res.ok && data.url) {
                        setPropertyImages(prev => {
                            const currentImages = [...(prev[imageType] || [])]
                            const index = currentImages.findIndex(img => img.file === file)
                            if (index !== -1) {
                                currentImages[index] = {
                                    ...currentImages[index],
                                    url: data.url,
                                    key: data.key || '',
                                    loading: false
                                }
                            }
                            return {
                                ...prev,
                                [imageType]: currentImages
                            }
                        })
                    }
                } catch (err) {
                    console.error('Error uploading image:', err)
                    // Remove the failed upload
                    setPropertyImages(prev => ({
                        ...prev,
                        [imageType]: prev[imageType]?.filter(img => img.file !== file) || []
                    }))
                }
            }
        }
    }
    const handleRemovePropertyImage = (imageType, imageData) => {
        if (imageType === 'primary') {
            // Remove primary image
            setPropertyImages(prev => ({
                ...prev,
                primary: null
            }))
        } else {
            // Remove from category array
            setPropertyImages(prev => ({
                ...prev,
                [imageType]: prev[imageType]?.filter(img => img.url !== imageData.url) || []
            }))
        }
    }

    // Document upload handlers for Step 13
    const handleDocumentUpload = async (docType, file) => {
        if (!file) return

        // Set loading state
        setDocuments(prev => ({
            ...prev,
            [docType]: { url: URL.createObjectURL(file), loading: true }
        }))

        // Upload to Cloudinary
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        try {
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            })
            const data = await res.json()

            if (res.ok && data.url) {
                setDocuments(prev => ({
                    ...prev,
                    [docType]: { url: data.url, key: data.key || '', loading: false }
                }))
            } else {
                console.error('Cloudinary upload failed:', data.error || 'Unknown error')
                setDocuments(prev => ({
                    ...prev,
                    [docType]: null
                }))
            }
        } catch (err) {
            console.error('Cloudinary upload error:', err.message)
            setDocuments(prev => ({
                ...prev,
                [docType]: null
            }))
        }
    }

    const handleRemoveDocument = (docType) => {
        setDocuments(prev => ({
            ...prev,
            [docType]: null
        }))
    }

    const handleProfilePhotoUpload = async (file) => {
        if (!file) return

        // Set loading state
        setProfilePhoto({ url: URL.createObjectURL(file), loading: true })

        // Upload to Cloudinary
        const formDataUpload = new FormData()
        formDataUpload.append('file', file)

        try {
            const res = await fetch('/api/cloudinary', {
                method: 'POST',
                body: formDataUpload
            })
            const data = await res.json()

            if (res.ok && data.url) {
                setProfilePhoto({ url: data.url, key: data.key || '', loading: false })
            } else {
                console.error('Cloudinary upload failed:', data.error || 'Unknown error')
                setProfilePhoto(null)
            }
        } catch (err) {
            console.error('Cloudinary upload error:', err.message)
            setProfilePhoto(null)
        }
    }

    const handleRemoveProfilePhoto = () => {
        setProfilePhoto(null)
    }

    const openRoomModal = (index = null) => {
        if (index !== null) {
            setEditingRoomIndex(index)
            setCurrentRoomData(roomFields[index])
        } else {
            setEditingRoomIndex(null)
            setCurrentRoomData({
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
            1: "To get started, select the type of property you want to list on www.rishikeshrent.com",
            2: "From the list below, which property category is the best fit for your place?",
            3: `How many ${getSelectedCategoryLabel()} are you listing?`,
            4: `One ${getSelectedPropertyTypeLabel()} where guests can book a room`,
            5: "Where else is your property listed?",
            6: "What's the name of your place?",
            7: "Where is your property?",
            8: `Tell us about your ${getSelectedCategoryLabel()}`,
            9: "Services at your property?",
            10: "What languages do you or your staff speak?",
            11: "House Rules",
            12: "Add rooms"
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
                                Step {currentStep} of 15
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex gap-1">
                            {Array.from({ length: 15 }, (_, i) => i + 1).map((step) => {
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
                                    'bg-cyan-500',   // Step 13
                                    'bg-sky-500',   // Step 14
                                    'bg-fuchsia-500',   // Step 15
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

                            {/* Furnishing Status - Only for Apartments with furnishing options */}
                            {selectedCategory === 'apartment' && selectedPropertyType && (() => {
                                const selectedType = getPropertyTypes().find(type => type.id === selectedPropertyType);
                                return selectedType?.hasFurnishing;
                            })() && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Furnishing Status</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Semi-Furnished Option */}
                                            <div
                                                onClick={() => setFurnishingStatus('semi-furnished')}
                                                className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${furnishingStatus === 'semi-furnished'
                                                    ? 'border-blue-600 bg-blue-50 shadow-md'
                                                    : 'border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${furnishingStatus === 'semi-furnished'
                                                            ? 'border-blue-600 bg-blue-600'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            <div className={`w-2 h-2 rounded-full bg-white transition-opacity duration-200 ${furnishingStatus === 'semi-furnished' ? 'opacity-100' : 'opacity-0'
                                                                }`}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4 className="font-semibold text-gray-900 mb-1">Semi-Furnished</h4>
                                                        <p className="text-sm text-gray-600 leading-snug">
                                                            Basic furniture provided including bed, sofa, fridge, and TV. Ideal for moving in with just a suitcase.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Fully Furnished Option */}
                                            <div
                                                onClick={() => setFurnishingStatus('fully-furnished')}
                                                className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${furnishingStatus === 'fully-furnished'
                                                    ? 'border-blue-600 bg-blue-50 shadow-md'
                                                    : 'border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${furnishingStatus === 'fully-furnished'
                                                            ? 'border-blue-600 bg-blue-600'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            <div className={`w-2 h-2 rounded-full bg-white transition-opacity duration-200 ${furnishingStatus === 'fully-furnished' ? 'opacity-100' : 'opacity-0'
                                                                }`}></div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4 className="font-semibold text-gray-900 mb-1">Fully Furnished</h4>
                                                        <p className="text-sm text-gray-600 leading-snug">
                                                            Complete home setup with designer furniture in every room. No need to buy furniture for multiple rooms.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* Subtype Selection - Only for Alternative Properties with subtypes */}
                            {selectedCategory === 'alternative' && selectedPropertyType && (() => {
                                const selectedType = getPropertyTypes().find(type => type.id === selectedPropertyType);
                                return selectedType?.subtypes && selectedType.subtypes.length > 0;
                            })() && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Subtype</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {getPropertyTypes().find(type => type.id === selectedPropertyType)?.subtypes.map((subtype) => (
                                                <div
                                                    key={subtype.id}
                                                    onClick={() => setAlternativeSubtype(subtype.id)}
                                                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${alternativeSubtype === subtype.id
                                                        ? 'border-blue-600 bg-blue-50 shadow-md'
                                                        : 'border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${alternativeSubtype === subtype.id
                                                                ? 'border-blue-600 bg-blue-600'
                                                                : 'border-gray-300'
                                                                }`}>
                                                                <div className={`w-2 h-2 rounded-full bg-white transition-opacity duration-200 ${alternativeSubtype === subtype.id ? 'opacity-100' : 'opacity-0'
                                                                    }`}></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow">
                                                            <h4 className="font-semibold text-gray-900">{subtype.label}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                            {/* For Homes: How many apartments are you listing? */}
                            {selectedCategory === 'apartment' ? (
                                <div className="mb-8">
                                    {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">How many apartments are you listing?</h2> */}
                                    <div className="space-y-4 max-w-2xl">
                                        {/* One apartment */}
                                        <div
                                            onClick={() => setHomeListingType('one')}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${homeListingType === 'one'
                                                ? 'border-blue-600 bg-blue-50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                                                        🏠
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-gray-900">One apartment</h3>
                                                </div>
                                                {homeListingType === 'one' && (
                                                    <div className="flex-shrink-0">
                                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Multiple apartments */}
                                        <div
                                            onClick={() => setHomeListingType('multiple')}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${homeListingType === 'multiple'
                                                ? 'border-blue-600 bg-blue-50 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                                                        🏘️
                                                    </div>
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-semibold text-gray-900">Multiple apartments</h3>
                                                </div>
                                                {homeListingType === 'multiple' && (
                                                    <div className="flex-shrink-0">
                                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* For Non-Homes (Apartments, Hotels, Alternative): Show room and floor counters */
                                <>
                                    <div className="mb-8">
                                        {/* Info box - Only for Hotels */}
                                        {selectedCategory === 'hotel' && (
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
                                        )}

                                        {/* What can guests book? - For Alternative and Homes */}
                                        {(selectedCategory === 'alternative' || selectedCategory === 'homes') && (
                                            <div className="mb-8">
                                                <h3 className="text-xl font-bold text-gray-900 mb-4">What can guests book?</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Entire Place Option */}
                                                    <div
                                                        onClick={() => setValue('alternativeBookingType', 'entire-place')}
                                                        className={`p-5 border-2 rounded-lg cursor-pointer transition-all duration-200 ${watch('alternativeBookingType') === 'entire-place'
                                                            ? 'border-blue-600 bg-blue-50'
                                                            : 'border-gray-300 hover:border-blue-400 bg-white'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">🏠</div>
                                                            </div>
                                                            <div className="flex-grow">
                                                                <h4 className="font-semibold text-lg text-gray-900 mb-1">Entire place</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    Guests have access to the entire place and don't have to share it with the host or other guests.
                                                                </p>
                                                            </div>
                                                            {watch('alternativeBookingType') === 'entire-place' && (
                                                                <div className="flex-shrink-0">
                                                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Private Room Option */}
                                                    <div
                                                        onClick={() => setValue('alternativeBookingType', 'private-room')}
                                                        className={`p-5 border-2 rounded-lg cursor-pointer transition-all duration-200 ${watch('alternativeBookingType') === 'private-room'
                                                            ? 'border-blue-600 bg-blue-50'
                                                            : 'border-gray-300 hover:border-blue-400 bg-white'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-4">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">🚪</div>
                                                            </div>
                                                            <div className="flex-grow">
                                                                <h4 className="font-semibold text-lg text-gray-900 mb-1">A private room</h4>
                                                                <p className="text-sm text-gray-600">
                                                                    Guests rent a room within the property. There are common areas that are shared with either the host or other guests.
                                                                </p>
                                                            </div>
                                                            {watch('alternativeBookingType') === 'private-room' && (
                                                                <div className="flex-shrink-0">
                                                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

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
                                </>
                            )}
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

                    {/* Step 4A: Where else is your property listed? - For all except Hotels */}
                    {currentStep === 5 && selectedCategory !== 'hotel' && (
                        <div className="mb-8">
                            {/* <h2 className="text-2xl font-bold text-gray-900 mb-4">Where else is your property listed?</h2> */}
                            <p className="text-gray-600 mb-6">If your property is listed on Airbnb, you can speed up registration by importing it directly from www.rishikeshrent.com</p>

                            <div className="space-y-4 max-w-2xl">
                                {/* Airbnb */}
                                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={listedWebsites.includes('airbnb')}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setListedWebsites([...listedWebsites, 'airbnb'])
                                            } else {
                                                setListedWebsites(listedWebsites.filter(w => w !== 'airbnb'))
                                            }
                                        }}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="font-semibold text-gray-900">Airbnb</span>
                                </label>

                                {/* TripAdvisor */}
                                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={listedWebsites.includes('tripadvisor')}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setListedWebsites([...listedWebsites, 'tripadvisor'])
                                            } else {
                                                setListedWebsites(listedWebsites.filter(w => w !== 'tripadvisor'))
                                            }
                                        }}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="font-semibold text-gray-900">TripAdvisor</span>
                                </label>

                                {/* Vrbo */}
                                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={listedWebsites.includes('vrbo')}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setListedWebsites([...listedWebsites, 'vrbo'])
                                            } else {
                                                setListedWebsites(listedWebsites.filter(w => w !== 'vrbo'))
                                            }
                                        }}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="font-semibold text-gray-900">Vrbo</span>
                                </label>

                                {/* Another website */}
                                <label className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={listedWebsites.includes('other')}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setListedWebsites([...listedWebsites, 'other'])
                                            } else {
                                                setListedWebsites(listedWebsites.filter(w => w !== 'other'))
                                                setCustomWebsite('')
                                            }
                                        }}
                                        className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <span className="font-semibold text-gray-900 block mb-2">Another website</span>
                                        {listedWebsites.includes('other') && (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={customWebsite}
                                                    onChange={(e) => setCustomWebsite(e.target.value)}
                                                    placeholder="Type the website name"
                                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <p className="text-sm text-gray-500 mt-1">This helps us identify potential import options.</p>
                                            </div>
                                        )}
                                    </div>
                                </label>

                                {/* Not listed */}
                                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={listedWebsites.includes('none')}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setListedWebsites(['none'])
                                            } else {
                                                setListedWebsites([])
                                            }
                                        }}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="font-semibold text-gray-900">My property isn't listed on any other websites</span>
                                </label>

                                {/* Airbnb Import Section */}
                                {listedWebsites.includes('airbnb') && (
                                    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Import property details from Airbnb <span className="text-blue-600 text-sm">(Optional)</span>
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">Paste the link to your Airbnb listing</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={airbnbImportLink}
                                                onChange={(e) => setAirbnbImportLink(e.target.value)}
                                                placeholder="https://www.airbnb.com/rooms/xxxxxxx"
                                                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {/* <button
                                                type="button"
                                                className="px-6 py-2 bg-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                                            >
                                                Import
                                            </button> */}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">Example link: https://www.airbnb.com/rooms/xxxxxxx</p>
                                        {/* <a href="#" className="text-sm text-blue-600 hover:underline mt-1 inline-block">Where can I find this link?</a> */}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 4B: What's the name of your place? - For all except Hotels */}
                    {currentStep === 6 && selectedCategory !== 'hotel' && (
                        <div className="mb-8">
                            {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">What's the name of your place?</h2> */}

                            <div className="max-w-2xl">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Property Name</label>
                                <input
                                    type="text"
                                    {...register('propertyName')}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter property name"
                                />

                                {/* Help boxes */}
                                <div className="mt-6 space-y-4">
                                    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">💡</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">What should I consider when choosing a name?</h4>
                                                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                                    <li>Keep it short and catchy</li>
                                                    <li>Avoid abbreviations</li>
                                                    <li>Stick to the facts</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">❓</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Why do I need to name my property?</h4>
                                                <p className="text-sm text-gray-600">
                                                    This is the name that will appear as the title of your listing on our site. It should tell guests something specific about your property and what you offer. This will be visible to anyone visiting our site, so don't include your address in the name.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Property Location */}
                    {currentStep === 7 && (
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

                    {/* Step 6/8: Property Details & Facilities */}
                    {currentStep === 8 && (
                        <div className="mb-8 flex md:flex-row flex-col items-start gap-3">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 border-2 border-gray-800 rounded-full flex items-center justify-center text-2xl">📍</div>
                            </div>
                            <div className="space-y-8 w-full">
                                <div className="flex items-center gap-3">
                                    <label className="block text-xl font-semibold text-gray-900 mb-2">What's the name of your {getSelectedPropertyTypeLabel()}?</label>
                                    <div>
                                        <input type="text" {...register('propertyName', { required: "Property Name is required" })}
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
                                        {errors.starRating && <p className="text-red-600 text-sm mt-2">{errors.starRating.message}</p>}
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
                                    {errors.ownershipType && <p className="text-red-600 text-sm mt-2">{errors.ownershipType.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left side - Facilities */}
                                    <div className="lg:col-span-2">
                                        <label className="block text-xl font-semibold text-gray-900 mb-3">What can guests use at your {getSelectedPropertyTypeLabel()}?</label>
                                        <div className="grid grid-cols-2 gap-1 mb-4">
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

                    {/* Step 7/9: Services (Breakfast & Parking) */}
                    {currentStep === 9 && (
                        <div className="mb-8">
                            <div className="space-y-8 max-w-2xl">
                                {/* Breakfast Section */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Breakfast</h2>
                                    <hr className='mb-2 border-black' />

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
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {/* Custom Breakfast Types */}
                                                    {customBreakfastTypes.map((type) => (
                                                        <label key={type._id} className="inline-flex items-center px-4 py-2 border-2 border-gray-300 rounded-full cursor-pointer hover:border-blue-500 hover:bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                                                            <input type="checkbox" value={type.name} {...register('breakfastTypes')} className="sr-only" />
                                                            <span className="text-sm text-gray-800">{type.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={openBreakfastModal}
                                                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                                                >
                                                    <span className="text-xl">+</span> Add More Breakfast Options
                                                </button>
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

                    {/* Step 8/10: Languages Spoken */}
                    {currentStep === 10 && (
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

                    {/* Step 9/11: House Rules */}
                    {currentStep === 11 && (
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

                    {currentStep === 12 && (
                        <div className="mb-8">
                            <div className="space-y-6">
                                {/* Progress Steps */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white border-gray-300 border-2 rounded-full flex items-center justify-center text-green-600 font-bold">🏨</div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-900">Step 1 - Property details</h3>
                                            <p className="text-sm text-gray-600">The basics: Add your property name, address, facilities, and more</p>
                                        </div>
                                        <button type="button" onClick={() => setCurrentStep(1)} className="px-2 w-40 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">Edit</button>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">🛏️</div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-900">Step 2 - Rooms</h3>
                                            <p className="text-sm text-gray-600">Tell us about your first room. Once you set one up you can add more</p>
                                        </div>
                                        <button type="button" onClick={() => setCurrentStep(13)}
                                            className="px-6 w-40 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                                            Add room
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">📷</div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-900">Step 3 - Photos</h3>
                                            <p className="text-sm text-gray-600">Show some photos of your property so guests know what to expect</p>
                                        </div>
                                        <button type="button" onClick={() => {
                                            setPhotoSectionView('selection') // Reset to selection screen
                                            setCurrentStep(14)
                                        }}
                                            className="px-2 w-40 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                                            Add photos
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                                        <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">✅</div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-900">Step 4 - Final steps</h3>
                                            <p className="text-sm text-gray-600">Set up payments and invoices before you open for bookings</p>
                                        </div>
                                        <button type="button" onClick={() => setCurrentStep(15)}
                                            className="px-2 w-40 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                                            Add final details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 10/12: Rooms */}
                    {currentStep === 13 && (
                        <div className="mb-8">
                            <div className="bg-white rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Your Rooms</h2>
                                <p className="text-gray-600 mb-6">Add and manage all the rooms for your property</p>

                                {/* Add Room Button */}
                                <button
                                    type="button"
                                    onClick={() => openRoomModal()}
                                    className="w-full mb-6 py-4 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg"
                                >
                                    <span className="text-2xl">+</span> Add New Room
                                </button>

                                {/* Existing Rooms List */}
                                {roomFields.length > 0 ? (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Rooms ({roomFields.length})</h3>
                                        <div className="space-y-3">
                                            {roomFields.map((room, index) => (
                                                <div key={room.id} className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                                                    <div className="flex-grow">
                                                        <h4 className="font-semibold text-gray-900">{room.roomType || `Room ${index + 1}`}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {room.bedTypes?.length > 0 && `${room.bedTypes.map(b => `${b.quantity}x ${bedTypesList.find(bt => bt.id === b.id)?.label}`).join(', ')} • `}
                                                            {room.roomSize && `${room.roomSize} ${room.roomSizeUnit === 'square-feet' ? 'sq ft' : 'm²'} • `}
                                                            {room.maxGuests && `${room.maxGuests} guests • `}
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
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                        <div className="text-6xl mb-4">🛏️</div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms added yet</h3>
                                        <p className="text-gray-600">Click the "Add New Room" button above to add your first room</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 12/14: Photo Uploads */}
                    {currentStep === 14 && (
                        <div className="mb-8">
                            <div className="bg-white rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Photos</h2>

                                {photoSectionView === 'selection' ? (
                                    /* Initial Selection Screen */
                                    <div className="space-y-6">
                                        <p className="text-gray-600 mb-8">Choose which type of photos you want to upload</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Add Room Photos Button */}
                                            <button
                                                type="button"
                                                onClick={() => setPhotoSectionView('rooms')}
                                                className="p-8 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                                            >
                                                <div className="text-center">
                                                    <div className="text-6xl mb-4">🛏️</div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Add Room Photos</h3>
                                                    <p className="text-gray-600">Upload images for each room including primary, room, and bathroom photos</p>
                                                </div>
                                            </button>

                                            {/* Add Property Images Button */}
                                            <button
                                                type="button"
                                                onClick={() => setPhotoSectionView('property')}
                                                className="p-8 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
                                            >
                                                <div className="text-center">
                                                    <div className="text-6xl mb-4">🏨</div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Add Property Images</h3>
                                                    <p className="text-gray-600">Upload general property images like exterior, interior, reception, etc.</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                ) : photoSectionView === 'rooms' ? (
                                    /* Room Photos Section */
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-semibold text-gray-900">Room Photos</h3>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPhotoSectionView('selection')
                                                    setShowRoomPhotoDetail(false)
                                                }}
                                                className="px-4 py-2 rounded-md border-2 border-blue-600 text-blue-600 font-semibold hover:underline"
                                            >
                                                ← Back to Selection
                                            </button>
                                        </div>

                                        {!showRoomPhotoDetail ? (
                                            /* Room Photos Table View */
                                            <div className="space-y-4">
                                                {roomFields.length > 0 ? (
                                                    roomFields.map((room, index) => (
                                                        <div key={room.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors">
                                                            <div className="flex-1 ">
                                                                <h3 className='text-sm font-semibold px-5 py-1 bg-red-400 w-fit rounded-md'>Room {index + 1}</h3>
                                                                <h4 className="font-semibold text-gray-900 text-lg">
                                                                    {room.roomType || `Room ${index + 1}`}
                                                                </h4>
                                                            </div>
                                                            <div className="flex gap-3 items-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openRoomPhotoDetail(index)}
                                                                    className="px-10 py-2 text-white rounded-lg font-semibold transition-colors"
                                                                    style={{ backgroundColor: index % 3 === 0 ? '#14b8a6' : index % 3 === 1 ? '#3b82f6' : '#22c55e' }}
                                                                >
                                                                    Upload Image
                                                                </button>
                                                                {/* <button type="button" className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">View</button>
                                                                <button type="button" className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">Edit</button>
                                                                <button type="button" className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200">Delete</button> */}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                                        <p className="text-gray-600">No rooms added yet. Please add rooms first.</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Room Photo Detail View */
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-semibold text-gray-900">
                                                        {roomFields[selectedRoomForPhotos]?.roomType || `Room ${selectedRoomForPhotos + 1}`}
                                                    </h4>
                                                    <button
                                                        type="button"
                                                        onClick={closeRoomPhotoDetail}
                                                        className="px-4 py-2 rounded-md border-2 border-blue-600 text-blue-600 font-semibold hover:underline"
                                                    >
                                                        ← Back to Rooms
                                                    </button>
                                                </div>

                                                {/* Primary Image */}
                                                <div className="p-4 border-2 border-gray-200 rounded-lg">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h5 className="font-semibold text-gray-900">Primary image</h5>
                                                            <p className="text-sm text-gray-600">exterior or interior image optional (Single image only)</p>
                                                        </div>
                                                        <div className="flex gap-3 items-center">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => e.target.files[0] && handleRoomImageUpload(selectedRoomForPhotos, 'primary', e.target.files[0])}
                                                                className="hidden"
                                                                id={`primary-${selectedRoomForPhotos}`}
                                                                disabled={roomImages[selectedRoomForPhotos]?.primary?.loading}
                                                            />
                                                            <label
                                                                htmlFor={`primary-${selectedRoomForPhotos}`}
                                                                className={`px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold cursor-pointer ${roomImages[selectedRoomForPhotos]?.primary?.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                {roomImages[selectedRoomForPhotos]?.primary?.loading ? 'Uploading...' : 'Upload Image'}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {roomImages[selectedRoomForPhotos]?.primary && (
                                                        <div className="relative inline-block">
                                                            <img src={roomImages[selectedRoomForPhotos].primary.url} alt="Primary preview" className="w-60 h-36 object-cover rounded-lg border-2 border-gray-300" />
                                                            {roomImages[selectedRoomForPhotos].primary.loading && (
                                                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                                    <div className="text-white text-xs">Uploading...</div>
                                                                </div>
                                                            )}
                                                            {!roomImages[selectedRoomForPhotos].primary.loading && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveRoomImage(selectedRoomForPhotos, 'primary', roomImages[selectedRoomForPhotos].primary)}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                                >
                                                                    ×
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Room Images */}
                                                <div className="p-4 border-2 border-gray-200 rounded-lg">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h5 className="font-semibold text-gray-900">Room Images</h5>
                                                            <p className="text-sm text-gray-600">Amenities with interior images (Multiple images allowed)</p>
                                                        </div>
                                                        <div className="flex gap-3 items-center">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={(e) => e.target.files.length > 0 && handleRoomImageUpload(selectedRoomForPhotos, 'room', e.target.files)}
                                                                className="hidden"
                                                                id={`room-${selectedRoomForPhotos}`}
                                                            />
                                                            <label
                                                                htmlFor={`room-${selectedRoomForPhotos}`}
                                                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold cursor-pointer"
                                                            >
                                                                Upload Images
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {roomImages[selectedRoomForPhotos]?.room && roomImages[selectedRoomForPhotos].room.length > 0 && (
                                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                            {roomImages[selectedRoomForPhotos].room.map((imageData, index) => (
                                                                <div key={index} className="relative">
                                                                    <img src={imageData.url} alt={`Room ${index + 1}`} className="h-32 w-full object-cover rounded-lg border-2 border-gray-300" />
                                                                    {imageData.loading && (
                                                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                                            <div className="text-white text-xs">Uploading...</div>
                                                                        </div>
                                                                    )}
                                                                    {!imageData.loading && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveRoomImage(selectedRoomForPhotos, 'room', imageData)}
                                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Bathroom Images */}
                                                <div className="p-4 border-2 border-gray-200 rounded-lg">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h5 className="font-semibold text-gray-900">Bathroom Images</h5>
                                                            <p className="text-sm text-gray-600">With all modern images (Multiple images allowed)</p>
                                                        </div>
                                                        <div className="flex gap-3 items-center">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={(e) => e.target.files.length > 0 && handleRoomImageUpload(selectedRoomForPhotos, 'bathroom', e.target.files)}
                                                                className="hidden"
                                                                id={`bathroom-${selectedRoomForPhotos}`}
                                                            />
                                                            <label
                                                                htmlFor={`bathroom-${selectedRoomForPhotos}`}
                                                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold cursor-pointer"
                                                            >
                                                                Upload Images
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {roomImages[selectedRoomForPhotos]?.bathroom && roomImages[selectedRoomForPhotos].bathroom.length > 0 && (
                                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                            {roomImages[selectedRoomForPhotos].bathroom.map((imageData, index) => (
                                                                <div key={index} className="relative">
                                                                    <img src={imageData.url} alt={`Bathroom ${index + 1}`} className="w-full h-32 object-cover rounded-lg border-2 border-gray-300" />
                                                                    {imageData.loading && (
                                                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                                            <div className="text-white text-xs">Uploading...</div>
                                                                        </div>
                                                                    )}
                                                                    {!imageData.loading && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveRoomImage(selectedRoomForPhotos, 'bathroom', imageData)}
                                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Save Button */}
                                                <div className="mt-6">
                                                    <button
                                                        type="button"
                                                        onClick={closeRoomPhotoDetail}
                                                        className="w-full px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                                                    >
                                                        Data Save
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* Property Photos Section */
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-semibold text-gray-900">Property Photos</h3>
                                            <button
                                                type="button"
                                                onClick={() => setPhotoSectionView('selection')}
                                                className="px-4 py-2 rounded-md border-2 border-blue-600 text-blue-600 font-semibold hover:underline"
                                            >
                                                ← Back to Selection
                                            </button>
                                        </div>

                                        <p className="text-gray-600 mb-6">Upload images for different areas of your property</p>

                                        <div className="space-y-6">
                                            {/* Primary Image - Single Upload */}
                                            <div className="p-4 border-2 border-gray-200 rounded-lg">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-gray-900">Primary Image</h5>
                                                        <p className="text-sm text-gray-600">Main property image (Single image only)</p>
                                                    </div>
                                                    <div className="flex gap-3 items-center">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => e.target.files[0] && handlePropertyImageUpload('primary', e.target.files[0])}
                                                            className="hidden"
                                                            id="property-primary"
                                                            disabled={propertyImages.primary?.loading}
                                                        />
                                                        <label
                                                            htmlFor="property-primary"
                                                            className={`px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-semibold cursor-pointer ${propertyImages.primary?.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {propertyImages.primary?.loading ? 'Uploading...' : 'Upload Image'}
                                                        </label>
                                                    </div>
                                                </div>
                                                {propertyImages.primary && (
                                                    <div className="relative inline-block">
                                                        <img src={propertyImages.primary.url} alt="Primary preview" className="w-48 h-32 object-cover rounded-lg border-2 border-gray-300" />
                                                        {propertyImages.primary.loading && (
                                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                                <div className="text-white text-xs">Uploading...</div>
                                                            </div>
                                                        )}
                                                        {!propertyImages.primary.loading && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemovePropertyImage('primary', propertyImages.primary)}
                                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Other Categories - Multiple Uploads */}
                                            {[
                                                { id: 'exterior', label: 'Exterior Images', color: '#3b82f6' },
                                                { id: 'interior', label: 'Interior Images', color: '#22c55e' },
                                                { id: 'reception', label: 'Reception Images', color: '#8b5cf6' },
                                                { id: 'restaurant', label: 'Restaurant Images', color: '#f59e0b' },
                                                { id: 'parking', label: 'Parking Images', color: '#6366f1' },
                                                { id: 'other', label: 'Other Images', color: '#64748b' }
                                            ].map((category) => (
                                                <div key={category.id} className="p-4 border-2 border-gray-200 rounded-lg">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h5 className="font-semibold text-gray-900">{category.label}</h5>
                                                            <p className="text-sm text-gray-600">Multiple images allowed</p>
                                                        </div>
                                                        <div className="flex gap-3 items-center">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={(e) => e.target.files.length > 0 && handlePropertyImageUpload(category.id, e.target.files)}
                                                                className="hidden"
                                                                id={`property-${category.id}`}
                                                            />
                                                            <label
                                                                htmlFor={`property-${category.id}`}
                                                                className="px-6 py-2 text-white rounded-lg font-semibold cursor-pointer transition-colors hover:opacity-90"
                                                                style={{ backgroundColor: category.color }}
                                                            >
                                                                Upload Images
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {propertyImages[category.id] && propertyImages[category.id].length > 0 && (
                                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                            {propertyImages[category.id].map((imageData, index) => (
                                                                <div key={index} className="relative">
                                                                    <img src={imageData.url} alt={`${category.label} ${index + 1}`} className="w-full h-32 object-cover rounded-lg border-2 border-gray-300" />
                                                                    {imageData.loading && (
                                                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                                            <div className="text-white text-xs">Uploading...</div>
                                                                        </div>
                                                                    )}
                                                                    {!imageData.loading && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemovePropertyImage(category.id, imageData)}
                                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Save Button */}
                                        <div className="mt-6">
                                            <button
                                                type="button"
                                                onClick={() => setPhotoSectionView('selection')}
                                                className="w-full px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                                            >
                                                Data Save
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 13/15: Owner, Property & Bank Information */}
                    {currentStep === 15 && (
                        <div className="mb-8">
                            <div className="bg-white rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 underline">Personal Information</h2>

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
                                                        placeholder="Type Here" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                                    <input type="email" {...register('ownerEmail')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        placeholder="Type Here" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                                                    <input type="tel" {...register('ownerContact', {
                                                        pattern: {
                                                            value: /^[0-9]{10}$/,
                                                            message: 'Contact number must be exactly 10 digits'
                                                        },
                                                        maxLength: {
                                                            value: 10,
                                                            message: 'Contact number must be 10 digits'
                                                        }
                                                    })}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        placeholder="Type Here"
                                                        maxLength="10" />
                                                    {errors.ownerContact && <p className="text-red-600 text-sm mt-1">{errors.ownerContact.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Aadhar Number</label>
                                                    <input type="tel" {...register('aadhaarNumber', {
                                                        pattern: {
                                                            value: /^[0-9]{12}$/, // 12 digits for Aadhar number
                                                            message: 'Aadhar number must be exactly 12 digits'
                                                        },
                                                        maxLength: {
                                                            value: 12,
                                                            message: 'Aadhar number must be 12 digits'
                                                        }
                                                    })}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        placeholder="Type Here"
                                                        maxLength="12" />
                                                    {errors.aadhaarNumber && <p className="text-red-600 text-sm mt-1">{errors.aadhaarNumber.message}</p>}
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
                                                        placeholder="Type Here" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Official Email</label>
                                                    <input type="email" {...register('officialEmail')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Type Here" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                                                        <input type="tel" {...register('officialContact', {
                                                            pattern: {
                                                                value: /^[0-9]{10}$/,
                                                                message: 'Contact number must be exactly 10 digits'
                                                            },
                                                            maxLength: {
                                                                value: 10,
                                                                message: 'Contact number must be 10 digits'
                                                            }
                                                        })}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="Type Here"
                                                            maxLength="10" />
                                                        {errors.officialContact && <p className="text-red-600 text-sm mt-1">{errors.officialContact.message}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Alternative Contact</label>
                                                        <input type="tel" {...register('alternativeContact', {
                                                            pattern: {
                                                                value: /^[0-9]{10}$/,
                                                                message: 'Contact number must be exactly 10 digits'
                                                            },
                                                            maxLength: {
                                                                value: 10,
                                                                message: 'Contact number must be 10 digits'
                                                            },
                                                            validate: (value) => {
                                                                const officialContact = watch('officialContact')
                                                                if (value && officialContact && value === officialContact) {
                                                                    return 'Alternative contact must be different from main contact number'
                                                                }
                                                                return true
                                                            }
                                                        })}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="Type Here"
                                                            maxLength="10" />
                                                        {errors.alternativeContact && <p className="text-red-600 text-sm mt-1">{errors.alternativeContact.message}</p>}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pan Number</label>
                                                        <input type="text" {...register('propertyPanNumber')}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="Type Here" />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            accept="image/*,application/pdf"
                                                            onChange={(e) => e.target.files[0] && handleDocumentUpload('propertyPanDoc', e.target.files[0])}
                                                            className="hidden"
                                                            id="property-pan-doc"
                                                            disabled={documents.propertyPanDoc?.loading}
                                                        />
                                                        <label
                                                            htmlFor="property-pan-doc"
                                                            className={`w-full mt-7 px-6 py-3 bg-white border-2 border-indigo-500 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 cursor-pointer inline-block text-center ${documents.propertyPanDoc?.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {documents.propertyPanDoc?.loading ? 'Uploading...' : 'Upload Document'}
                                                        </label>
                                                    </div>
                                                    {documents.propertyPanDoc && (
                                                        <div className="mt-2 p-3 rounded-lg">
                                                            <div className="flex flex-col items-start gap-3">
                                                                <p className="text-md font-semibold text-black">Property PAN Document</p>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative">
                                                                        <img src={documents.propertyPanDoc.url} alt="Property PAN" className="w-60 h-24 object-cover rounded border-2 border-indigo-200 hover:border-indigo-400 transition-colors" />
                                                                        {documents.propertyPanDoc?.loading && (
                                                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                                                                                <div className="text-white text-sm font-semibold">Uploading...</div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {!documents.propertyPanDoc.loading && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveDocument('propertyPanDoc')}
                                                                            className="px-3 py-1.5 text-sm text-white bg-red-400 hover:bg-red-500 rounded font-semibold transition-colors"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">GST Number</label>
                                                        <input type="text" {...register('gstNumber')}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                            placeholder="Type Here" />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            accept="image/*,application/pdf"
                                                            onChange={(e) => e.target.files[0] && handleDocumentUpload('gstDoc', e.target.files[0])}
                                                            className="hidden"
                                                            id="gst-doc"
                                                            disabled={documents.gstDoc?.loading}
                                                        />
                                                        <label
                                                            htmlFor="gst-doc"
                                                            className={`w-full mt-7 px-6 py-3 bg-white border-2 border-indigo-500 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 cursor-pointer inline-block text-center ${documents.gstDoc?.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {documents.gstDoc?.loading ? 'Uploading...' : 'Upload Document'}
                                                        </label>
                                                    </div>
                                                </div>
                                                {documents.gstDoc && (
                                                    <div className="mt-2 p-3 rounded-lg">
                                                        <div className="flex flex-col items-start gap-3">
                                                            <p className="text-md font-semibold text-black">GST Document</p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative">
                                                                    <img src={documents.gstDoc.url} alt="GST Document" className="w-60 h-24 object-cover rounded border-2 border-indigo-200 hover:border-indigo-400 transition-colors" />
                                                                    {documents.gstDoc?.loading && (
                                                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                                                                            <div className="text-white text-sm font-semibold">Uploading...</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {!documents.gstDoc.loading && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveDocument('gstDoc')}
                                                                        className="px-3 py-1.5 text-sm text-white bg-red-400 hover:bg-red-500 rounded font-semibold transition-colors"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* Bank Information */}
                                        <div className="border-t border-gray-200 pt-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Bank Information</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                                                    <input type="text" {...register('bankName')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Type Here" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                                                    <input type="text" {...register('accountNumber')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Type Here" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">A/C Holder Name</label>
                                                    <input type="text" {...register('accountHolderName')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Type Here" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                                                        <input type="text" {...register('ifscCode')}
                                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                            placeholder="Type Here" />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="file"
                                                            accept="image/*,application/pdf"
                                                            onChange={(e) => e.target.files[0] && handleDocumentUpload('bankChequeDoc', e.target.files[0])}
                                                            className="hidden"
                                                            id="bank-cheque-doc"
                                                            disabled={documents.bankChequeDoc?.loading}
                                                        />
                                                        <label
                                                            htmlFor="bank-cheque-doc"
                                                            className={`w-full mt-7 px-6 py-3 bg-white border-2 border-purple-500 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 cursor-pointer inline-block text-center ${documents.bankChequeDoc?.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {documents.bankChequeDoc?.loading ? 'Uploading...' : 'Upload Cheque Document'}
                                                        </label>
                                                    </div>
                                                </div>
                                                {documents.bankChequeDoc && (
                                                    <div className="mt-2 p-3 rounded-lg">
                                                        <div className="flex flex-col items-start gap-3">
                                                            <p className="text-md font-semibold text-gray-700">Bank Cheque</p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative">
                                                                    <img src={documents.bankChequeDoc.url} alt="Bank Cheque" className="w-60 h-28 object-cover rounded-md border-2 border-gray-500 hover:border-gray-900 transition-colors" />
                                                                    {documents.bankChequeDoc?.loading && (
                                                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                                                                            <div className="text-white text-sm font-semibold">Uploading...</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {!documents.bankChequeDoc.loading && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveDocument('bankChequeDoc')}
                                                                        className="px-3 py-1.5 text-sm text-white bg-red-400 hover:bg-red-500 rounded font-semibold transition-colors"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Address</label>
                                                    <input type="text" {...register('bankAddress')}
                                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Type Here" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Profile Photo */}
                                    <div className="lg:col-span-1">
                                        <div className="sticky top-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Profile Photo</label>
                                            <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300 relative overflow-hidden">
                                                {profilePhoto ? (
                                                    <>
                                                        <img src={profilePhoto.url} alt="Profile" className="w-full h-full object-cover" />
                                                        {profilePhoto.loading && (
                                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                                <span className="text-white text-sm font-semibold">Uploading...</span>
                                                            </div>
                                                        )}
                                                        {!profilePhoto.loading && (
                                                            <button
                                                                type="button"
                                                                onClick={handleRemoveProfilePhoto}
                                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 font-bold text-lg"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">Upload Photo</span>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files[0] && handleProfilePhotoUpload(e.target.files[0])}
                                                className="hidden"
                                                id="profile-photo"
                                                disabled={profilePhoto?.loading}
                                            />
                                            <label
                                                htmlFor="profile-photo"
                                                className={`w-full mt-4 px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 cursor-pointer inline-block text-center ${profilePhoto?.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {profilePhoto?.loading ? 'Uploading...' : 'Choose File'}
                                            </label>
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

                        {/* Hide Continue button on Step 1 - users must click category card button */}
                        {currentStep > 1 && (
                            <button type="button"
                                className="ml-auto min-w-[200px] px-12 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-base font-semibold transition-all duration-300 shadow-lg hover:from-orange-600 hover:to-orange-700 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:opacity-60 disabled:transform-none"
                                onClick={handleContinue}
                                disabled={
                                    isSubmitting ||
                                    (currentStep === 2 && !selectedPropertyType && !customPropertyType) ||
                                    (currentStep === 4 && !propertyConfirmation) ||
                                    (currentStep === 12 && roomFields.length === 0) ||
                                    // Disable on Step 12/14 if any images are uploading
                                    ((selectedCategory === 'apartment' ? currentStep === 14 : currentStep === 12) && (() => {
                                        // Check if any room images are uploading
                                        const roomImagesUploading = Object.values(roomImages).some(room =>
                                            room?.primary?.loading ||
                                            room?.room?.some(img => img?.loading) ||
                                            room?.bathroom?.some(img => img?.loading)
                                        );

                                        // Check if any property images are uploading
                                        const propertyImagesUploading =
                                            propertyImages?.primary?.loading ||
                                            propertyImages?.exterior?.some(img => img?.loading) ||
                                            propertyImages?.interior?.some(img => img?.loading) ||
                                            propertyImages?.reception?.some(img => img?.loading) ||
                                            propertyImages?.restaurant?.some(img => img?.loading) ||
                                            propertyImages?.parking?.some(img => img?.loading) ||
                                            propertyImages?.other?.some(img => img?.loading);

                                        return roomImagesUploading || propertyImagesUploading;
                                    })()) ||
                                    // Disable on Step 13/15 if any documents or profile photo are uploading
                                    ((selectedCategory === 'apartment' ? currentStep === 15 : currentStep === 13) && (
                                        documents?.propertyPanDoc?.loading ||
                                        documents?.gstDoc?.loading ||
                                        documents?.bankChequeDoc?.loading ||
                                        profilePhoto?.loading
                                    ))
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
                                    currentStep === 12 ? 'Submit Data...' : 'Continue'
                                )}
                            </button>
                        )}
                    </div>
                </form >
            </div >

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
                                    {currentRoomData.privateBathroom === true && (
                                        <div>
                                            <label className="block text-base font-semibold text-gray-900 mb-3">What bathroom items are available in this room?</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {customBathroomItems.map(item => (
                                                    <label key={item._id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                        <input type="checkbox" checked={currentRoomData.bathroomItems?.includes(item.name) || false}
                                                            onChange={() => {
                                                                const items = currentRoomData.bathroomItems || []
                                                                updateRoomField('bathroomItems', items.includes(item.name)
                                                                    ? items.filter(i => i !== item.name)
                                                                    : [...items, item.name])
                                                            }}
                                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                                        <span className="text-sm text-gray-800">{item.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <button type="button" onClick={openBathroomModal} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">+ Add More</button>
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
                                            {bedTypesList.slice(0, showAllBeds ? bedTypesList.length : 4).map(bed => (
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
                                        <button
                                            type="button"
                                            onClick={() => setShowAllBeds(!showAllBeds)}
                                            className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
                                        >
                                            {showAllBeds ? '- Show fewer bed options' : '+ Show more bed options'}
                                        </button>
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
                                                {customGeneralAmenities.map(item => (
                                                    <label key={item._id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                        <input type="checkbox" checked={currentRoomData.roomFacilities?.includes(item.name) || false}
                                                            onChange={() => toggleRoomFacility(item.name)}
                                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                                        <span className="text-sm text-gray-800">{item.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <button type="button" onClick={openGeneralAmenityModal} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">+ Add More</button>
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
                                                {customOutdoorItems.map(item => (
                                                    <label key={item._id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                        <input type="checkbox" checked={currentRoomData.outdoorViews?.includes(item.name) || false}
                                                            onChange={() => {
                                                                const items = currentRoomData.outdoorViews || []
                                                                updateRoomField('outdoorViews', items.includes(item.name)
                                                                    ? items.filter(i => i !== item.name)
                                                                    : [...items, item.name])
                                                            }}
                                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                                        <span className="text-sm text-gray-800">{item.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <button type="button" onClick={openOutdoorModal} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">+ Add More</button>
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
                                                {customFoodDrinkItems.map(item => (
                                                    <label key={item._id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                        <input type="checkbox" checked={currentRoomData.foodDrink?.includes(item.name) || false}
                                                            onChange={() => {
                                                                const items = currentRoomData.foodDrink || []
                                                                updateRoomField('foodDrink', items.includes(item.name)
                                                                    ? items.filter(i => i !== item.name)
                                                                    : [...items, item.name])
                                                            }}
                                                            className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
                                                        <span className="text-sm text-gray-800">{item.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <button type="button" onClick={openFoodDrinkModal} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700">+ Add More</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Price Per Night */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Set the price per night for this room</h3>

                                <div className="grid grid-cols-3 w-full items-center gap-6 space-x-2">
                                    {/* Left Column - Price Input */}
                                    <div className="w-full">
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
                                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-5">
                                        <p className="text-sm text-gray-700 mb-2">
                                            <span className="font-semibold">15.0%</span> www.rishikeshrent.com commission
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <span className="text-green-600 mt-0.5">✓</span>
                                                <p className="text-sm text-gray-700">24/7 help in your language</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-green-600 mt-0.5">✓</span>
                                                <p className="text-sm text-gray-700">Save time with automatically confirmed bookings</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-green-600 mt-0.5">✓</span>
                                                <p className="text-sm text-gray-700">We promote your place on Google</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Info Box */}
                                    <div className="w-80">
                                        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-5">
                                            <div className="flex items-start justify-between mb-3">
                                                <h4 className="font-semibold text-gray-900">What if I'm not sure about my price?</h4>
                                                <button type="button" className="text-gray-400 hover:text-gray-600">✕</button>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-4">
                                                Don't worry, you can always change it later. You can even set weekend, midweek, and seasonal prices, giving you complete control over what you earn.
                                            </p>

                                        </div>
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

            {/* Custom Breakfast Type Modal */}
            {isBreakfastModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                        {/* Close button */}
                        <button
                            onClick={closeBreakfastModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ✕
                        </button>

                        {/* Modal Header */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Custom Breakfast Type</h2>
                        <p className="text-sm text-gray-600 mb-6">
                            Add a breakfast type that's not in the default list. It will be saved to the database for future use.
                        </p>

                        {/* Input Field */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                Breakfast Type Name *
                            </label>
                            <input
                                type="text"
                                value={newBreakfastType}
                                onChange={(e) => setNewBreakfastType(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomBreakfast()}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Mediterranean, Organic, etc."
                                autoFocus
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={closeBreakfastModal}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                disabled={isSavingBreakfast}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddCustomBreakfast}
                                disabled={!newBreakfastType.trim() || isSavingBreakfast}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {isSavingBreakfast ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Breakfast Type'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bathroom Items Modal */}
            {isBathroomModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                        <button onClick={closeBathroomModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Bathroom Item</h2>
                        <p className="text-sm text-gray-600 mb-6">Add a custom bathroom item for your rooms.</p>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Item Name *</label>
                            <input type="text" value={newBathroomItem} onChange={(e) => setNewBathroomItem(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddBathroomItem()}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Bidet, Shower cap" autoFocus />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={closeBathroomModal} disabled={isSavingBathroom}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">Cancel</button>
                            <button type="button" onClick={handleAddBathroomItem} disabled={!newBathroomItem.trim() || isSavingBathroom}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2">
                                {isSavingBathroom ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</> : 'Save Item'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* General Amenities Modal */}
            {isGeneralAmenityModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                        <button onClick={closeGeneralAmenityModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add General Amenity</h2>
                        <p className="text-sm text-gray-600 mb-6">Add a custom general amenity for your rooms.</p>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Amenity Name *</label>
                            <input type="text" value={newGeneralAmenity} onChange={(e) => setNewGeneralAmenity(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddGeneralAmenity()}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Iron, Ironing board" autoFocus />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={closeGeneralAmenityModal} disabled={isSavingGeneralAmenity}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">Cancel</button>
                            <button type="button" onClick={handleAddGeneralAmenity} disabled={!newGeneralAmenity.trim() || isSavingGeneralAmenity}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2">
                                {isSavingGeneralAmenity ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</> : 'Save Amenity'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Outdoors and Views Modal */}
            {isOutdoorModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                        <button onClick={closeOutdoorModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Outdoor/View Item</h2>
                        <p className="text-sm text-gray-600 mb-6">Add a custom outdoor or view feature for your rooms.</p>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Feature Name *</label>
                            <input type="text" value={newOutdoorItem} onChange={(e) => setNewOutdoorItem(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddOutdoorItem()}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Garden view, Patio" autoFocus />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={closeOutdoorModal} disabled={isSavingOutdoor}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">Cancel</button>
                            <button type="button" onClick={handleAddOutdoorItem} disabled={!newOutdoorItem.trim() || isSavingOutdoor}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2">
                                {isSavingOutdoor ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</> : 'Save Feature'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Food and Drink Modal */}
            {isFoodDrinkModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                        <button onClick={closeFoodDrinkModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">✕</button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Food/Drink Item</h2>
                        <p className="text-sm text-gray-600 mb-6">Add a custom food or drink amenity for your rooms.</p>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Item Name *</label>
                            <input type="text" value={newFoodDrinkItem} onChange={(e) => setNewFoodDrinkItem(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddFoodDrinkItem()}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., Microwave, Refrigerator" autoFocus />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={closeFoodDrinkModal} disabled={isSavingFoodDrink}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50">Cancel</button>
                            <button type="button" onClick={handleAddFoodDrinkItem} disabled={!newFoodDrinkItem.trim() || isSavingFoodDrink}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2">
                                {isSavingFoodDrink ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</> : 'Save Item'}
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
        </div >
    )
}

export default PropertyRegistration
