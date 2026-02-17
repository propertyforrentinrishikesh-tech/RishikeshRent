# Firebase Phone Authentication Setup Guide

## 📋 Complete Step-by-Step Instructions

---

## PART 1: Firebase Console Setup

### Step 1: Create Firebase Project
1. Go to: https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name: `rishikesh-rent`
4. Click "Continue"
5. Disable Google Analytics (optional)
6. Click "Create project"
7. Wait for setup, then click "Continue"

### Step 2: Register Web App
1. Click the Web icon (`</>`) in Firebase Console
2. Enter app nickname: `Rishikesh Rent Web`
3. Click "Register app"
4. **COPY THE FIREBASE CONFIG** - you'll need this!
5. Click "Continue to console"

### Step 3: Enable Phone Authentication
1. Sidebar: Click "Build" → "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click "Phone" in the list
5. Toggle "Enable" to ON
6. Click "Save"

### Step 4: Add Authorized Domains
1. In Authentication → "Settings" tab
2. Scroll to "Authorized domains"
3. Add your domains:
   - `localhost` (already there)
   - Your production domain
4. Click "Add domain"

---

## PART 2: Project Setup

### Step 1: Install Firebase
```bash
npm install firebase
```

### Step 2: Add Firebase Config to .env.local

Create or edit `.env.local` file in your project root and add:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**IMPORTANT**: Replace the values with your actual Firebase config from Step 2 above!

### Step 3: Restart Development Server

After adding environment variables, restart your dev server:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## PART 3: Usage in Your Component

### Example: Using in PropertyDetails.jsx

```jsx
import PhoneOTPVerification from '@/components/PhoneOTPVerification';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Inside your component:
const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

// Handle verification success
const handleVerificationSuccess = (userData) => {
    console.log('User verified:', userData);
    // userData contains: { phoneNumber, uid }
    
    // You can now submit your form or perform final actions
    toast.success('Phone verified! Submitting form...');
    setIsOTPModalOpen(false);
    
    // Submit your property form here
    handleSubmit();
};

// In your JSX:
<Button 
    className="w-full text-lg bg-blue-600 hover:bg-blue-700"
    onClick={() => setIsOTPModalOpen(true)}
>
    Get OTP For Final Approval
</Button>

{/* OTP Modal */}
<Dialog open={isOTPModalOpen} onOpenChange={setIsOTPModalOpen}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Verify Your Phone Number</DialogTitle>
        </DialogHeader>
        <PhoneOTPVerification 
            onVerificationSuccess={handleVerificationSuccess}
        />
    </DialogContent>
</Dialog>
```

---

## 🔧 Troubleshooting

### Issue: "reCAPTCHA verification failed"
**Solution**: Make sure your domain is added to Firebase Authorized Domains

### Issue: "Too many requests"
**Solution**: Firebase has rate limits. Wait a few minutes and try again.

### Issue: "Invalid phone number"
**Solution**: Phone number must be in format: +91XXXXXXXXXX (10 digits after +91)

### Issue: Environment variables not working
**Solution**: 
1. Make sure `.env.local` is in project root
2. Restart dev server after adding env variables
3. Check for typos in variable names

---

## 🚀 Testing

### Test Phone Numbers (for development)
Firebase allows test phone numbers without sending real SMS:

1. Go to Firebase Console → Authentication → Sign-in method
2. Scroll to "Phone numbers for testing"
3. Add test numbers:
   - Phone: `+91 1234567890`
   - OTP: `123456`

Now you can test without using real SMS credits!

---

## 📊 Monitoring Usage

1. Go to Firebase Console → Authentication → Usage
2. Check your monthly verification count
3. Free tier: 10,000 verifications/month

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env.local` to git
2. ✅ Add `.env.local` to `.gitignore`
3. ✅ Use different Firebase projects for dev/production
4. ✅ Enable App Check for production
5. ✅ Set up Firebase Security Rules

---

## 📝 Next Steps

1. [ ] Create Firebase project
2. [ ] Get Firebase config
3. [ ] Add config to `.env.local`
4. [ ] Install firebase package
5. [ ] Test with test phone numbers
6. [ ] Deploy and test with real numbers

---

## 💰 Pricing Reminder

- **Free Tier**: 10,000 verifications/month
- **After Free Tier**: $0.01 per verification
- **Your current usage**: Check Firebase Console → Authentication → Usage

---

## 🆘 Need Help?

- Firebase Docs: https://firebase.google.com/docs/auth/web/phone-auth
- Firebase Support: https://firebase.google.com/support
- Stack Overflow: Tag with `firebase` and `firebase-authentication`
