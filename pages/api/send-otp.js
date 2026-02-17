import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { mobile } = req.body;

    // Validate mobile number
    if (!mobile || mobile.length !== 10) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid 10-digit mobile number'
        });
    }

    try {
        // MSG91 Send OTP API
        const response = await axios.post(
            'https://control.msg91.com/api/v5/otp',
            {
                template_id: process.env.NEXT_PUBLIC_MSG91_TEMPLATE_ID,
                mobile: `91${mobile}`, // Add country code
                authkey: process.env.NEXT_PUBLIC_MSG91_AUTH_KEY,
                // Optional: Add custom variables for your template
                // otp_expiry: 5, // OTP expiry in minutes
                // otp_length: 6, // OTP length
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log('MSG91 Response:', response.data);

        if (response.data.type === 'success') {
            return res.status(200).json({
                success: true,
                message: 'OTP sent successfully!',
                data: response.data
            });
        } else {
            return res.status(400).json({
                success: false,
                message: response.data.message || 'Failed to send OTP'
            });
        }

    } catch (error) {
        console.error('MSG91 Error:', error.response?.data || error.message);

        return res.status(500).json({
            success: false,
            message: error.response?.data?.message || 'Failed to send OTP. Please try again.',
            error: error.response?.data || error.message
        });
    }
}
