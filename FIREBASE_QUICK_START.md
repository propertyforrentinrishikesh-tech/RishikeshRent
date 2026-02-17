# 🔥 Firebase Phone OTP - Quick Reference

## ✅ What I've Set Up For You

### 1. **Files Created**
- ✅ `lib/firebase.js` - Firebase configuration
- ✅ `components/PhoneOTPVerification.jsx` - Ready-to-use OTP component
- ✅ `FIREBASE_SETUP_GUIDE.md` - Complete setup instructions

### 2. **Package Installed**
- ✅ `firebase` - Currently installing...

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Firebase Credentials
1. Go to: https://console.firebase.google.com/
2. Create new project: "rishikesh-rent"
3. Add web app
4. **Copy the config object**

### Step 2: Add to .env.local
Create `.env.local` in project root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=rishikesh-rent.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=rishikesh-rent
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=rishikesh-rent.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc...
```

### Step 3: Enable Phone Auth in Firebase
1. Firebase Console → Authentication → Sign-in method
2. Enable "Phone"
3. Save

### Step 4: Add Test Phone Number (Optional)
1. Firebase Console → Authentication → Sign-in method
2. Scroll to "Phone numbers for testing"
3. Add: `+91 1234567890` with code `123456`

### Step 5: Restart Dev Server
```bash
npm run dev
```

---

## 💻 How to Use in Your Code

### Example: In PropertyDetails.jsx

```jsx
import PhoneOTPVerification from '@/components/PhoneOTPVerification';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Add state
const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

// Handle success
const handleOTPVerified = (userData) => {
    console.log('Verified:', userData.phoneNumber);
    setIsOTPModalOpen(false);
    // Now submit your form
    handleSubmit();
};

// Replace your button
<Button 
    onClick={() => setIsOTPModalOpen(true)}
    className="w-full text-lg bg-blue-600 hover:bg-blue-700"
>
    Get OTP For Final Approval
</Button>

// Add modal
<Dialog open={isOTPModalOpen} onOpenChange={setIsOTPModalOpen}>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Verify Phone Number</DialogTitle>
        </DialogHeader>
        <PhoneOTPVerification onVerificationSuccess={handleOTPVerified} />
    </DialogContent>
</Dialog>
```

---

## 🧪 Testing

### With Test Numbers (No SMS sent)
1. Add test number in Firebase Console
2. Use: +91 1234567890
3. OTP: 123456

### With Real Numbers
1. Enter real 10-digit number
2. Receive SMS with OTP
3. Enter 6-digit code

---

## 📊 Component Features

✅ Phone number input with +91 prefix
✅ 10-digit validation
✅ Send OTP button
✅ OTP input (6 digits)
✅ Verify OTP button
✅ Resend OTP option
✅ Change number option
✅ Loading states
✅ Error handling
✅ Success callback
✅ Toast notifications
✅ Invisible reCAPTCHA

---

## 🔐 Security

- ✅ Environment variables for credentials
- ✅ reCAPTCHA spam protection
- ✅ Firebase rate limiting
- ✅ Secure phone verification

---

## 💰 Pricing

- **Free**: 10,000 verifications/month
- **Paid**: $0.01 per verification after free tier

---

## 🆘 Common Issues

### "reCAPTCHA verification failed"
→ Add your domain to Firebase Authorized Domains

### "Too many requests"
→ Wait a few minutes, Firebase has rate limits

### "Invalid phone number"
→ Must be 10 digits, format: +91XXXXXXXXXX

### Environment variables not working
→ Restart dev server after adding .env.local

---

## 📚 Full Documentation

See `FIREBASE_SETUP_GUIDE.md` for complete instructions!

---

## ✨ Next Steps

1. [ ] Create Firebase project
2. [ ] Get credentials
3. [ ] Add to .env.local
4. [ ] Enable Phone Auth
5. [ ] Test with test number
6. [ ] Integrate into PropertyDetails
7. [ ] Test with real number
8. [ ] Deploy! 🚀
