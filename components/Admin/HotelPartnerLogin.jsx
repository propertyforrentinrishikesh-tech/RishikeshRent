"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Building2, User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import toast from "react-hot-toast"
import { signIn } from "next-auth/react"

export default function HotelPartnerLogin() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        hotelCode: "",
        username: "",
        password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await fetch('/api/auth/hotel-partner-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hotelCode: formData.hotelCode,
                    username: formData.username,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.message || "Invalid credentials. Please try again.")
                return
            }

            if (data.success) {
                // Store complete hotel partner property data in localStorage
                localStorage.setItem('hotelPartnerSession', JSON.stringify(data.property))

                toast.success("Login successful!")
                router.push('/admin/hotel_property_updates')
            }
        } catch (err) {
            setError("An error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true)
        setError("")

        toast.error("Google Sign-In is currently unavailable for hotel partners. Please use Hotel Code, Username, and Password to login.")
        setIsLoading(false)

        // Note: To enable Google login without affecting admin session,
        // you would need to implement a separate OAuth flow using Google's
        // JavaScript SDK or a different authentication provider
    }

    return (
        <div className="min-h-screen flex items-center justify-center font-barlow px-4 py-10 bg-gradient-to-br from-blue-50 to-indigo-100">
            <Card className="w-full max-w-md shadow-2xl border-2 border-gray-200">
                <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="text-3xl font-bold text-center">
                        Private Dashboard
                    </CardTitle>
                    <CardDescription className="text-center text-blue-100">
                        Hotel Partner Login Portal
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Hotel Code */}
                        <div className="space-y-2">
                            <Label htmlFor="hotelCode" className="text-base font-semibold">Hotel Code</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="hotelCode"
                                    name="hotelCode"
                                    type="text"
                                    placeholder="Enter your hotel code"
                                    className="pl-10 h-12 border-2 border-gray-300 focus:border-blue-500 focus-visible:ring-0 rounded-full"
                                    value={formData.hotelCode}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-base font-semibold">User Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    className="pl-10 h-12 border-2 border-gray-300 focus:border-blue-500 focus-visible:ring-0 rounded-full"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-base font-semibold">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="pl-10 pr-10 h-12 border-2 border-gray-300 focus:border-blue-500 focus-visible:ring-0 rounded-full"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Divider */}
                        {/* <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-4 text-gray-500 font-medium">Or</span>
                            </div>
                        </div> */}

                        {/* Google Sign In */}
                        {/* <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={true}
                                className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center opacity-50 cursor-not-allowed"
                                title="Google Sign-In is currently unavailable"
                            >
                                <svg viewBox="0 0 24 24" className="h-6 w-6">
                                    <path
                                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                        fill="#EA4335"
                                    />
                                    <path
                                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                                        fill="#34A853"
                                    />
                                </svg>
                            </button>
                        </div> */}

                        {/* Login Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}