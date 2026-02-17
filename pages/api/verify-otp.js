import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { mobile, otp } = req.body;

    // Validate inputs
    if (!mobile || mobile.length !== 10) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid 10-digit mobile number'
        });
    }

    if (!otp || otp.length !== 6) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid 6-digit OTP'
        });
    }

    try {
        // MSG91 Verify OTP API
        const response = await axios.get(
            `https://control.msg91.com/api/v5/otp/verify`,
            {
                params: {
                    authkey: process.env.NEXT_PUBLIC_MSG91_AUTH_KEY,
                    mobile: `91${mobile}`, // Add country code
                    otp: otp
                }
            }
        );

        console.log('MSG91 Verify Response:', response.data);

        if (response.data.type === 'success') {
            return res.status(200).json({
                success: true,
                message: 'OTP verified successfully!',
                data: response.data
            });
        } else {
            return res.status(400).json({
                success: false,
                message: response.data.message || 'Invalid OTP. Please try again.'
            });
        }

    } catch (error) {
        console.error('MSG91 Verify Error:', error.response?.data || error.message);

        // Handle specific error cases
        if (error.response?.data?.message?.includes('already_verified')) {
            return res.status(400).json({
                success: false,
                message: 'OTP already verified. Please request a new OTP.'
            });
        }

        if (error.response?.data?.message?.includes('otp_expired')) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new OTP.'
            });
        }

        return res.status(500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to verify OTP. Please try again.',
            error: error.response?.data || error.message
        });
    }
}
