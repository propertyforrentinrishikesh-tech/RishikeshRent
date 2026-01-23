"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import B2CPrice from './HotelPartnerSidebar/B2CPrice';
import BulkPriceUpdate from './HotelPartnerSidebar/BulkPriceUpdate';
import WeekendPrice from './HotelPartnerSidebar/WeekendPrice';
import SpecialOfferPrice from './HotelPartnerSidebar/SpecialOfferPrice';
import PlanPriceUpdate from './HotelPartnerSidebar/PlanPriceUpdate';
import Restrictions from './HotelPartnerSidebar/Restrictions';
import Photos from './HotelPartnerSidebar/Photos';
import Descriptions from './HotelPartnerSidebar/Descriptions';
import FacilitiesAmenities from './HotelPartnerSidebar/FacilitiesAmenities';
import RatePlans from './HotelPartnerSidebar/RatePlans';

const HotelPartnerUpdates = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [partnerSession, setPartnerSession] = useState(null);
    const [allProperties, setAllProperties] = useState([]);
    const [approvedProperties, setApprovedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('');
    const [expandedSections, setExpandedSections] = useState({
        'rates': false,
        'content': false,
        'reservations': false,
        'promotions': false,
        'reviews': false,
        'official': false,
        'property': false
    });

    // Check authentication on mount
    useEffect(() => {
        const session = localStorage.getItem('hotelPartnerSession');
        if (!session) {
            router.push('/admin/hotel_property_updates/login');
            return;
        }

        try {
            const parsedSession = JSON.parse(session);
            if (!parsedSession.isActive) {
                toast.error('Your account is inactive. Please contact support.');
                handleLogout();
                return;
            }
            setPartnerSession(parsedSession);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Invalid session:', error);
            router.push('/admin/hotel_property_updates/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('hotelPartnerSession');
        setIsAuthenticated(false);
        setPartnerSession(null);
        toast.success('Logged out successfully');
        router.push('/admin/hotel_property_updates/login');
    };

    // Fetch all properties
    useEffect(() => {
        setLoading(true);
        fetch(`/api/addPropertyRegistration`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(data => {
                setAllProperties(data.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Fetch approved properties
    useEffect(() => {
        setLoading(true);
        fetch(`/api/addPropertyRegistration/isApproved`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(data => {
                setApprovedProperties(data.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const menuStructure = [
        {
            id: 'dashboard',
            label: "Hotel Partner's Login Dashboard",
            bgColor: 'bg-yellow-400',
            textColor: 'text-black',
            isHeader: true  // Just a header, not clickable
        },
        {
            id: 'rates',
            label: 'Rates and Availability',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            children: [
                {
                    id: 'calendar',
                    label: 'Calendar',
                    description: 'Manage rates, availability, and restrictions for dates.',
                    children: [
                        // { id: 'year-calendar', label: 'Year Calendar', description: 'View and manage yearly calendar.' },
                        { id: 'b2c-price', label: 'B2C Price', description: 'Ideal for standard bookings on normal periods.' },
                        { id: 'bulk-price-update', label: 'Bulk Price Update', description: 'Setting your base rates for the entire upcoming year.' },
                        { id: 'weekend-price', label: 'Weekend Price', description: 'Weekend Escape Rates, perfect for leisure nights!' },
                        { id: 'special-offer-price', label: 'Special Offer Price', description: 'The "Best Value" Approach.' }
                    ]
                },
                {
                    id: 'rate-plans', label: 'Rate Plans', description: 'Create and manage rate plans.',
                    children: [
                        { id: 'create-plan', label: 'Create Plan / Package', description: 'Meal for Standard bookings or seasonal promotions' },
                        { id: 'plan-price-update', label: 'Plan Price Update', description: 'Setting your base rates for the entire upcoming year.' },
                    ]
                },
                {
                    id: 'restrictions', label: 'Restrictions', description: 'Set minimum stay, closed to arrival, etc.',
                    children: [
                        { id: 'krc-update', label: 'KRC Update', description: 'View and update room availability for specific dates.' },
                    ]
                }
            ]
        },
        {
            id: 'content',
            label: 'Content and Property Profile',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            children: [
                { id: 'photos', label: 'Photos', description: 'Images of rooms, bathrooms and common areas.' },
                { id: 'facilities', label: 'Facilities & Amenities', description: 'Cehckboxes for WiFi, pool, parking, air conditioning, etc.' },
                { id: 'descriptions', label: 'Descriptions', description: 'Write or edit the "About Us" text and room specific details.' }
            ]
        },
        {
            id: 'reservations',
            label: 'Reservations and Finance',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            children: [
                { id: 'bookings-list', label: 'Bookings List', description: 'View all bookings.' },
                { id: 'confirm-no-show', label: 'Confirm Or No-Show Bookings', description: 'Manage booking confirmations.' },
                { id: 'invoices', label: 'Invoices / Payouts History', description: 'View financial records.' },
                { id: 'financial-overview', label: 'All Financial Overview', description: 'Complete financial summary.' },
                { id: 'payout-settings', label: 'Payout Settings', description: 'Configure payout preferences.' }
            ]
        },
        {
            id: 'promotions',
            label: 'Promotions and Marketing',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            children: [
                { id: 'deals', label: 'Deals', description: 'Create special offers and deals.' },
                { id: 'genius-program', label: 'Genius / Preferred Programs', description: 'Manage loyalty programs.' },
                { id: 'reviews-marketing', label: 'Reviews', description: 'Respond to guest reviews.' }
            ]
        },
        {
            id: 'reviews',
            label: 'Review Management',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            isSingle: true
        },
        {
            id: 'official',
            label: 'Official & Contact Info',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            children: [
                { id: 'contact-management', label: 'Contact Management', description: 'Update contact details.' },
                { id: 'legal-document', label: 'Legal Document', description: 'Manage legal documents.' },
                { id: 'financial-info', label: 'Financial Info', description: 'Update financial information.' }
            ]
        },
        {
            id: 'property',
            label: 'Property Status',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            children: [
                { id: 'auto-closed', label: 'Auto-Closed (Availability)', description: 'Manage auto-closure settings.' },
                { id: 'closed-payment', label: 'Closed (Payment Pending)', description: 'Properties with pending payments.' },
                { id: 'suspended', label: 'Suspended / Terminated', description: 'View suspended properties.' },
                { id: 'maintenance', label: 'Maintenance Review', description: 'Properties under maintenance.' },
                { id: 'reinstatement', label: 'Reinstatement Review', description: 'Request reinstatement.' },
                { id: 'close-property', label: 'Close Property', description: 'Permanently close property.' }
            ]
        }
    ];

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const renderContent = () => {
        const activeItem = menuStructure.find(section =>
            section.id === activeSection ||
            section.children?.some(child => child.id === activeSection)
        );

        // Render specific components based on active section
        switch (activeSection) {
            case 'b2c-price':
                return <B2CPrice />
            case 'bulk-price-update':
                return <BulkPriceUpdate />
            case 'weekend-price':
                return <WeekendPrice />
            case 'special-offer-price':
                return <SpecialOfferPrice />
            case 'create-plan':
                return <RatePlans />
            case 'plan-price-update':
                return <PlanPriceUpdate />
            case 'krc-update':
                return <Restrictions />
            case 'photos':
                return <Photos />
            case 'facilities':
                return <FacilitiesAmenities />
            case 'descriptions':
                return <Descriptions />
            default:
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {activeItem?.label || 'Select a section'}
                        </h2>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <p className="text-gray-~600">
                                Content for <strong>{activeSection}</strong> will be displayed here.
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                This section is under development.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{ minHeight: '50vh', background: '#fff' }}>
            {loading || !isAuthenticated ? (
                <div className="text-center text-lg font-semibold p-8">Loading partner details...</div>
            ) : (
                <>
                    {/* Header with Property Info and Logout */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
                        <div>
                            <h1 className="text-2xl font-bold">{partnerSession?.propertyName}</h1>
                            <p className="text-sm text-blue-100">
                                Hotel Code: <span className="font-semibold">{partnerSession?.hotelCode}</span> |
                                Username: <span className="font-semibold ml-2">{partnerSession?.username}</span>
                            </p>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-white"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>

                    <div className="flex h-full">
                        {/* Sidebar */}
                        <div className="w-60 bg-gray-100 border-r border-gray-300 overflow-y-auto">
                            {menuStructure.map((section) => (
                                <div key={section.id} className="mb-1">
                                    {/* Main Section Header */}
                                    <div
                                        className={`${section.bgColor} ${section.textColor} px-4 py-3 font-semibold flex items-center justify-between ${section.isHeader ? '' : 'cursor-pointer hover:opacity-90 transition-opacity'
                                            }`}
                                        onClick={() => {
                                            if (section.isHeader) return; // Don't do anything for header
                                            if (section.isSingle) {
                                                setActiveSection(section.id);
                                            } else {
                                                toggleSection(section.id);
                                            }
                                        }}
                                    >
                                        <span className="text-sm">{section.label}</span>
                                        {!section.isSingle && !section.isHeader && (
                                            expandedSections[section.id] ?
                                                <ChevronDown className="h-4 w-4" /> :
                                                <ChevronRight className="h-4 w-4" />
                                        )}
                                    </div>

                                    {/* Subsections */}
                                    {!section.isSingle && !section.isHeader && expandedSections[section.id] && (
                                        <div className="bg-gray-200">
                                            {section.children?.map((child) => (
                                                <div key={child.id}>
                                                    {/* Child Item */}
                                                    <div
                                                        className={`px-6 py-3 cursor-pointer border-b border-gray-300 hover:bg-gray-300 transition-colors ${activeSection === child.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
                                                            }`}
                                                        onClick={() => {
                                                            if (child.children) {
                                                                toggleSection(child.id);
                                                            } else {
                                                                setActiveSection(child.id);
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="font-medium text-sm text-gray-900">{child.label}</div>
                                                                <div className="text-xs text-gray-600 mt-1">{child.description}</div>
                                                            </div>
                                                            {child.children && (
                                                                expandedSections[child.id] ?
                                                                    <ChevronDown className="h-3 w-3 ml-2" /> :
                                                                    <ChevronRight className="h-3 w-3 ml-2" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Nested Children (Third Level) */}
                                                    {child.children && expandedSections[child.id] && (
                                                        <div className="bg-gray-300">
                                                            {child.children.map((subChild) => (
                                                                <div
                                                                    key={subChild.id}
                                                                    className={`px-8 py-2.5 cursor-pointer border-b border-gray-400 hover:bg-gray-400 transition-colors ${activeSection === subChild.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
                                                                        }`}
                                                                    onClick={() => setActiveSection(subChild.id)}
                                                                >
                                                                    <div className="font-medium text-xs text-gray-900">{subChild.label}</div>
                                                                    <div className="text-xs text-gray-600 mt-0.5">{subChild.description}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 overflow-y-auto bg-white">
                            {renderContent()}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HotelPartnerUpdates;
