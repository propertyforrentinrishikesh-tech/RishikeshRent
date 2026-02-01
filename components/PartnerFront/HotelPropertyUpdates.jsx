"use client"
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import B2CPrice from '@/components/Admin/HotelPartnerSidebar/B2CPrice';
import BulkPriceUpdate from '@/components/Admin/HotelPartnerSidebar/BulkPriceUpdate';
import WeekendPrice from '@/components/Admin/HotelPartnerSidebar/WeekendPrice';
import SpecialOfferPrice from '@/components/Admin/HotelPartnerSidebar/SpecialOfferPrice';
import PlanPriceUpdate from '@/components/Admin/HotelPartnerSidebar/PlanPriceUpdate';
import Restrictions from '@/components/Admin/HotelPartnerSidebar/Restrictions';
import Photos from '@/components/Admin/HotelPartnerSidebar/Photos';
import Descriptions from '@/components/Admin/HotelPartnerSidebar/Descriptions';
import FacilitiesAmenities from '@/components/Admin/HotelPartnerSidebar/FacilitiesAmenities';
import RatePlans from '@/components/Admin/HotelPartnerSidebar/RatePlans';
import BookingsList from '@/components/Admin/HotelPartnerSidebar/BookingsList';
import ConfirmNoShow from '@/components/Admin/HotelPartnerSidebar/ConfirmNoShow';
import InvoicesPayouts from '@/components/Admin/HotelPartnerSidebar/InvoicesPayouts';
import FinancialOverview from '@/components/Admin/HotelPartnerSidebar/FinancialOverview';
import PayoutSettings from '@/components/Admin/HotelPartnerSidebar/PayoutSettings';
import Deals from '@/components/Admin/HotelPartnerSidebar/Deals';
import CreateDiscount from '@/components/Admin/HotelPartnerSidebar/CreateDiscount';
import ReviewsGuestExperience from '@/components/Admin/HotelPartnerSidebar/ReviewsGuestExperience';
import ReviewManagement from '@/components/Admin/HotelPartnerSidebar/ReviewManagement';
import PropertyLocation from '@/components/Admin/HotelPartnerSidebar/PropertyLocation';
import BankInformation from '@/components/Admin/HotelPartnerSidebar/BankInformation';
import PropertyInformation from '@/components/Admin/HotelPartnerSidebar/PropertyInformation';
import NonPerformingAccount from '@/components/Admin/HotelPartnerSidebar/NonPerformingAccount';
import OverdueCommission from '@/components/Admin/HotelPartnerSidebar/OverdueCommission';
import SuspendedAccount from '@/components/Admin/HotelPartnerSidebar/SuspendedAccount';
import HowToFix from '@/components/Admin/HotelPartnerSidebar/HowToFix';
import ReinstatementProcess from '@/components/Admin/HotelPartnerSidebar/ReinstatementProcess';
import OTATerminationLetter from '@/components/Admin/HotelPartnerSidebar/OTATerminationLetter';
import AdministrativeNotifications from '@/components/Admin/HotelPartnerSidebar/AdministrativeNotifications';
import PaymentDetailsPayouts from '@/components/Admin/HotelPartnerSidebar/PaymentDetailsPayouts';
import SuspendedTerminatedPolicy from '@/components/Admin/HotelPartnerSidebar/SuspendedTerminatedPolicy';
import OfficialAdminCorrespondence from '@/components/Admin/HotelPartnerSidebar/OfficialAdminCorrespondence';
import ReinstatementTimelines from '@/components/Admin/HotelPartnerSidebar/ReinstatementTimelines';
import PermanentContractTermination from '@/components/Admin/HotelPartnerSidebar/PermanentContractTermination';

const HotelPropertyUpdates = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [partnerSession, setPartnerSession] = useState(null);
    const [propertyData, setPropertyData] = useState(null);
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
            router.push('/partner/login');
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
            setPropertyData(parsedSession);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Invalid session:', error);
            router.push('/partner/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('hotelPartnerSession');
        setIsAuthenticated(false);
        setPartnerSession(null);
        toast.success('Logged out successfully');
        router.push('/partner/login');
    };

    // Function to refresh property data from database
    const refreshPropertyData = async () => {
        if (!propertyData?._id) return;

        try {
            const propertyId = propertyData._id.$oid || propertyData._id;

            const response = await fetch(`/api/addPropertyRegistration?id=${propertyId}`);
            const data = await response.json();

            if (data.success && data.data) {
                setPropertyData(data.data);
                // Also update localStorage
                const session = JSON.parse(localStorage.getItem('hotelPartnerSession'));
                const updatedSession = { ...session, ...data.data };
                localStorage.setItem('hotelPartnerSession', JSON.stringify(updatedSession));
            }
        } catch (error) {
            console.error('Error refreshing property data:', error);
        }
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
            ]
        },
        {
            id: 'reviews',
            label: 'Review Management',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            children: [
                { id: 'create-review', label: 'Create Review', description: 'Create a review for the property.' },
                { id: 'review-management', label: 'Review Management', description: 'Soliciting reiviews from guest to improve your ranking.' },
            ]
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
                { id: 'howtofix', label: 'How to Fix', description: 'How to fix suspended properties.' },
                { id: 'reinstatement', label: 'Reinstatement Review', description: 'Request reinstatement.' },
                { id: 'close-property', label: 'Close Property', description: 'Permanently close property.' }
            ]
        },
        {
            id: 'admin-main-inbox',
            label: 'Admin Main Inbox',
            bgColor: 'bg-blue-500',
            textColor: 'text-white',
            children: [
                { id: 'availability-status', label: 'Availability Status', description: 'Availability Status / Notice' },
                { id: 'payout-transfer', label: 'Payout Transfer Detail', description: 'Payout Transfer Detail' },
                { id: 'suspended', label: 'Suspended ("Terminated")', description: 'Suspended ("Terminated")' },
                { id: 'official-admin-correspondence', label: 'Official / Admin Correspondence', description: 'Official / Admin Correspondence' },
                { id: 'reinstatement-status', label: 'Reinstatement Status', description: 'Reinstatement Status' },
                { id: 'close-property-admin', label: 'Close Property', description: 'Permanently close property.' }
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
        // Pass propertyData as props to all components
        switch (activeSection) {
            case 'b2c-price':
                return <B2CPrice propertyData={propertyData} />
            case 'bulk-price-update':
                return <BulkPriceUpdate propertyData={propertyData} />
            case 'weekend-price':
                return <WeekendPrice propertyData={propertyData} />
            case 'special-offer-price':
                return <SpecialOfferPrice propertyData={propertyData} />
            case 'create-plan':
                return <RatePlans propertyData={propertyData} />
            case 'plan-price-update':
                return <PlanPriceUpdate propertyData={propertyData} />
            case 'photos':
                return <Photos propertyData={propertyData} onDataUpdate={refreshPropertyData} />
            case 'facilities':
                return <FacilitiesAmenities propertyData={propertyData} onDataUpdate={refreshPropertyData} />
            case 'descriptions':
                return <Descriptions propertyData={propertyData} />
            case 'krc-update':
                return <Restrictions propertyData={propertyData} />
            case 'bookings-list':
                return <BookingsList propertyData={propertyData} />
            case 'confirm-no-show':
                return <ConfirmNoShow propertyData={propertyData} />
            case 'invoices':
                return <InvoicesPayouts propertyData={propertyData} />
            case 'financial-overview':
                return <FinancialOverview propertyData={propertyData} />
            case 'payout-settings':
                return <PayoutSettings propertyData={propertyData} />
            case 'reviews-marketing':
                return <ReviewsMarketing propertyData={propertyData} />
            case 'deals':
                return <CreateDiscount propertyData={propertyData} />
            case 'genius-program':
                return <Deals propertyData={propertyData} />
            case 'create-review':
                return <ReviewsGuestExperience propertyData={propertyData} />
            case 'review-management':
                return <ReviewManagement propertyData={propertyData} />
            case 'contact-management':
                return <PropertyLocation propertyData={propertyData} onDataUpdate={refreshPropertyData}/>
            case 'legal-document':
                return <BankInformation propertyData={propertyData} onDataUpdate={refreshPropertyData} />
            case 'financial-info':
                return <PropertyInformation propertyData={propertyData} onDataUpdate={refreshPropertyData} />
            case 'auto-closed':
                return <NonPerformingAccount propertyData={propertyData} />
            case 'closed-payment':
                return <OverdueCommission propertyData={propertyData} />
            case 'suspended':
                return <SuspendedAccount propertyData={propertyData} />
            case 'howtofix':
                return <HowToFix propertyData={propertyData} />
            case 'reinstatement':
                return <ReinstatementProcess propertyData={propertyData} />
            case 'maintenance':
                return <Maintenance propertyData={propertyData} />
            case 'close-property':
                return <OTATerminationLetter propertyData={propertyData} />
            case 'availability-status':
                return <AdministrativeNotifications propertyData={propertyData} />
            case 'payout-transfer':
                return <PaymentDetailsPayouts propertyData={propertyData} />
            case 'suspended':
                return <SuspendedTerminatedPolicy propertyData={propertyData} />
            case 'official-admin-correspondence':
                return <OfficialAdminCorrespondence propertyData={propertyData} />
            case 'reinstatement-status':
                return <ReinstatementTimelines propertyData={propertyData} />
            case 'close-property-admin':
                return <PermanentContractTermination propertyData={propertyData} />
            default:
                return (
                    <div className="p-6 flex items-center w-full justify-center">
                        <h2 className="text-2xl font-bold">
                            {activeItem?.label || '⬅️⬅️ Select Any Section'}
                        </h2>
                        {/* <div className="bg-gray-50 p-6 rounded-lg">
                            <p className="text-gray-600">
                                Content for <strong>{activeSection}</strong> will be displayed here.
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                This section is under development.
                            </p>
                        </div> */}
                    </div>
                );
        }
    };

    return (
        <div className="px-5 py-1" style={{ minHeight: '50vh' }}>
            {loading || !isAuthenticated ? (
                <div className="flex items-center w-full justify-center text-center text-lg font-semibold p-8">
                    <p className="flex items-center gap-2">
                        <Loader2 className="animate-spin duration-700 repeat-infinite" /> Loading partner details...</p></div>
            ) : (
                <>
                    {/* Header with Property Info and Logout */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 mb-2 flex justify-between items-center shadow-md">
                        <div>
                            <h1 className="text-2xl font-bold">{partnerSession?.propertyName}</h1>
                            <p className="text-sm text-blue-100">
                                Hotel Code: <span className="font-semibold pr-2">{partnerSession?.hotelCode}</span> |
                                Username: <span className="font-semibold pl-2">{partnerSession?.partnerUsername}</span>
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

                    <div className="flex min-h-[50vh]">
                        {/* Sidebar */}
                        <div className="w-64 border-r border-gray-300 overflow-y-auto max-h-screen">
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

export default HotelPropertyUpdates;
