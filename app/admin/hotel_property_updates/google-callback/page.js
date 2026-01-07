"use client"

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function GoogleCallbackPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        const handleGoogleLogin = async () => {
            if (status === 'loading') return

            if (status === 'unauthenticated') {
                toast.error('Google sign-in failed')
                router.push('/admin/hotel_property_updates/login')
                return
            }

            if (session?.user?.email) {
                try {
                    // Check if this Google account is linked to a property
                    const response = await fetch('/api/auth/hotel-partner-google', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: session.user.email
                        }),
                    })

                    const data = await response.json()

                    if (!response.ok) {
                        toast.error(data.message || 'No property found for this Google account')
                        router.push('/admin/hotel_property_updates/login')
                        return
                    }

                    if (data.success) {
                        // Store hotel partner session
                        localStorage.setItem('hotelPartnerSession', JSON.stringify({
                            propertyId: data.property._id,
                            propertyName: data.property.propertyName,
                            hotelCode: data.property.hotelCode,
                            username: data.property.partnerUsername,
                            isActive: data.property.isActive,
                            loginMethod: 'google'
                        }))

                        toast.success('Login successful!')
                        router.push('/admin/hotel_property_updates')
                    }
                } catch (error) {
                    console.error('Google login error:', error)
                    toast.error('An error occurred during login')
                    router.push('/admin/hotel_property_updates/login')
                }
            }
        }

        handleGoogleLogin()
    }, [session, status, router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg font-semibold text-gray-700">Verifying your Google account...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait</p>
            </div>
        </div>
    )
}
