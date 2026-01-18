"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

const FacilitiesAmenities = () => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            selectedRoom: '',
            bathroomAmenities: [],
            generalAmenities: [],
            outdoorViews: [],
            foodDrink: []
        }
    })

    const [bathroomAmenities, setBathroomAmenities] = useState({
        bathTub: false,
        bidet: false,
        freeToiletries: false,
        hairdryer: false,
        bathrobe: false,
        shower: false,
        slippers: false,
        toilet: false
    })

    const [generalAmenities, setGeneralAmenities] = useState({
        airConditioning: false,
        clothesRack: false,
        fan: false,
        heater: false,
        ironingFacilities: false,
        mosquitoNet: false,
        privateEntrance: false,
        sofa: false,
        soundproofing: false,
        tile: false,
        towels: false,
        extraLongBeds: false
    })

    const [outdoorViews, setOutdoorViews] = useState({
        balcony: false,
        terrace: false,
        cityView: false,
        gardenView: false,
        mountainView: false,
        riverView: false
    })

    const [foodDrink, setFoodDrink] = useState({
        electricKettle: false,
        teaCoffeeMaker: false,
        bottledWater: false,
        diningTable: false,
        minibar: false
    })

    const onSubmit = (data) => {
        console.log('Form Data:', data)
        // Add your save logic here
    }

    const toggleBathroomAmenity = (amenity) => {
        setBathroomAmenities(prev => ({
            ...prev,
            [amenity]: !prev[amenity]
        }))
    }

    const toggleGeneralAmenity = (amenity) => {
        setGeneralAmenities(prev => ({
            ...prev,
            [amenity]: !prev[amenity]
        }))
    }

    const toggleOutdoorView = (view) => {
        setOutdoorViews(prev => ({
            ...prev,
            [view]: !prev[view]
        }))
    }

    const toggleFoodDrink = (item) => {
        setFoodDrink(prev => ({
            ...prev,
            [item]: !prev[item]
        }))
    }

    return (
        <div className="w-full mx-auto p-6 space-y-6 bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Content and Property Profile</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Facilities & Amenities Section */}
                <Card className="shadow-md">
                    <CardContent className="p-6 space-y-4">
                        <div className="bg-cyan-400 p-3 rounded-lg">
                            <h2 className="text-lg font-bold text-gray-900">Facilities & Amenities</h2>
                            <p className="text-xs text-gray-700">Select all amenities available</p>
                        </div>

                        {/* Choose Room */}
                        <div>
                            <Label htmlFor="selectedRoom" className="block text-sm font-semibold text-gray-700 mb-2">
                                Choose Room
                            </Label>
                            <div className="relative">
                                <select
                                    id="selectedRoom"
                                    {...register('selectedRoom', { required: 'Room selection is required' })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="">Select room...</option>
                                    <option value="deluxe">Deluxe Room</option>
                                    <option value="suite">Suite</option>
                                    <option value="premium">Premium Room</option>
                                    <option value="standard">Standard Room</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.selectedRoom && (
                                <p className="text-red-500 text-sm mt-1">{errors.selectedRoom.message}</p>
                            )}
                        </div>

                        {/* Bathroom Amenities */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700">
                                What bathroom items are available in this room?
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries({
                                    bathTub: 'Bath tub',
                                    bidet: 'Bidet',
                                    freeToiletries: 'Free toiletries',
                                    hairdryer: 'Hairdryer',
                                    bathrobe: 'Bathrobe',
                                    shower: 'Shower',
                                    slippers: 'Slippers',
                                    toilet: 'Toilet'
                                }).map(([key, label]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={key}
                                            checked={bathroomAmenities[key]}
                                            onCheckedChange={() => toggleBathroomAmenity(key)}
                                        />
                                        <label
                                            htmlFor={key}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                + Add more
                            </Button>
                        </div>

                        {/* General Amenities */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700">General amenities</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries({
                                    airConditioning: 'Air conditioning',
                                    clothesRack: 'Clothes rack',
                                    fan: 'Fan',
                                    heater: 'Heater',
                                    ironingFacilities: 'Ironing facilities',
                                    mosquitoNet: 'Mosquito net',
                                    privateEntrance: 'Private entrance',
                                    sofa: 'Sofa',
                                    soundproofing: 'Soundproofing',
                                    tile: 'Tile/Marble floor',
                                    towels: 'Towels',
                                    extraLongBeds: 'Extra long beds (> 2 metres)'
                                }).map(([key, label]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={key}
                                            checked={generalAmenities[key]}
                                            onCheckedChange={() => toggleGeneralAmenity(key)}
                                        />
                                        <label
                                            htmlFor={key}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                + Add more
                            </Button>
                        </div>

                        {/* Outdoor and views */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700">Outdoor and views</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries({
                                    balcony: 'Balcony',
                                    terrace: 'Terrace',
                                    cityView: 'City view',
                                    gardenView: 'Garden view',
                                    mountainView: 'Mountain view',
                                    riverView: 'River view'
                                }).map(([key, label]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={key}
                                            checked={outdoorViews[key]}
                                            onCheckedChange={() => toggleOutdoorView(key)}
                                        />
                                        <label
                                            htmlFor={key}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                + Add more
                            </Button>
                        </div>

                        {/* Food and drink */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700">Food and drink</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries({
                                    electricKettle: 'Electric kettle',
                                    teaCoffeeMaker: 'Tea/Coffee maker',
                                    bottledWater: 'Bottled water',
                                    diningTable: 'Dining table',
                                    minibar: 'Minibar'
                                }).map(([key, label]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={key}
                                            checked={foodDrink[key]}
                                            onCheckedChange={() => toggleFoodDrink(key)}
                                        />
                                        <label
                                            htmlFor={key}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                + Add more
                            </Button>
                        </div>

                        {/* Data Save Button */}
                        <Button
                            type="submit"
                            className="w-full py-6 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-lg transition-colors shadow-lg mt-6"
                        >
                            Data Save
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

export default FacilitiesAmenities
