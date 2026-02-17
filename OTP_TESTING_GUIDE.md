# 🧪 OTP Testing Guide

## ✅ Setup Complete - Ready for Testing!

The OTP functionality is now ready to test. The form submission has been commented out so you can focus on testing the OTP flow.

---

## 📋 Testing Steps

### **Option 1: Test with Firebase Test Phone Number (Recommended)**

This method doesn't send real SMS and is FREE!

#### **Setup Test Number in Firebase:**
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Go to **Authentication** → **Sign-in method**
4. Scroll down to **"Phone numbers for testing"**
5. Click **"Add phone number"**
6. Add:
   - **Phone number**: `+91 1234567890`
   - **Test code**: `123456`
7. Click **Save**

#### **Test in Your App:**
1. Open your app: http://localhost:3000/admin/property_extranet
2. Fill in the property form
3. In **Contact Numbers** field, enter: `1234567890`
4. Click **"Get OTP For Final Approval"**
5. Modal opens with phone number pre-filled
6. Click **"Get OTP"** button
7. Enter OTP: `123456`
8. Click **"Verify OTP"**
9. ✅ Success! Check console for verification data

---

### **Option 2: Test with Real Phone Number**

This will send actual SMS (uses Firebase free tier).

#### **Test in Your App:**
1. Open your app: http://localhost:3000/admin/property_extranet
2. Fill in the property form
3. In **Contact Numbers** field, enter your real 10-digit number
4. Click **"Get OTP For Final Approval"**
5. Modal opens with phone number pre-filled
6. Click **"Get OTP"** button
7. Wait for SMS (usually arrives in 10-30 seconds)
8. Enter the 6-digit OTP from SMS
9. Click **"Verify OTP"**
10. ✅ Success! Check console for verification data

---

## ⏱️ Testing the 30-Second Timer

1. Send OTP
2. Notice the "Resend OTP" button shows: **"Resend OTP in 30s"**
3. Watch it countdown: 29s, 28s, 27s...
4. Button is **disabled and gray** during countdown
5. After 30 seconds, button becomes **blue and clickable**
6. You can now resend OTP

---

## 🔍 What to Check

### **In Browser Console:**
```javascript
// When OTP is sent:
"reCAPTCHA solved"

// When OTP is verified successfully:
"Phone verified: { phoneNumber: '+911234567890', uid: '...' }"
"OTP Verified! Ready to submit form with data: { ... }"
```

### **Toast Notifications:**
- ✅ "OTP sent successfully!"
- ✅ "Phone number verified successfully!"
- ❌ "Invalid OTP. Please try again." (if wrong code)
- ❌ "Please enter a valid 10-digit broker contact number first!" (if number missing)

---

## 🐛 Common Issues & Solutions

### **Issue: "reCAPTCHA verification failed"**
**Solution**: 
- Make sure your domain is added to Firebase Authorized Domains
- Check: Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` if not there

### **Issue: "Too many requests"**
**Solution**: 
- Firebase has rate limits
- Wait 5-10 minutes and try again
- Use test phone numbers to avoid this

### **Issue: "Invalid phone number"**
**Solution**: 
- Must be exactly 10 digits
- No spaces, dashes, or special characters
- Example: `1234567890` ✅
- Example: `123-456-7890` ❌

### **Issue: OTP not arriving**
**Solution**: 
- Check your Firebase free tier quota (10,000/month)
- Verify phone number is correct
- Check spam/blocked messages
- Try test phone number instead

### **Issue: Environment variables not working**
**Solution**: 
- Make sure `.env.local` exists in project root
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again
- Check for typos in variable names

---

## 📊 Expected Behavior

### **Successful Flow:**
1. ✅ Button click → Validates contact number
2. ✅ Modal opens → Phone number pre-filled
3. ✅ Click "Get OTP" → Loading state
4. ✅ OTP sent → Success toast + Timer starts (30s)
5. ✅ Enter OTP → 6 digits
6. ✅ Click "Verify" → Loading state
7. ✅ Verified → Success toast + Modal closes + Console log

### **Timer Behavior:**
- Starts at 30 seconds after OTP sent
- Counts down every second
- Button disabled during countdown
- Button enabled when timer reaches 0
- Can resend OTP after timer expires

---

## 🎯 Next Steps After Testing

Once OTP is working:

1. **Uncomment the form submission**:
   ```javascript
   // In PropertyDetails.jsx, line ~4927
   handleSubmit(); // Uncomment this
   ```

2. **Implement handleSubmit function** to save property data to database

3. **Add loading states** during form submission

4. **Handle success/error** from API

---

## 📝 Test Checklist

- [ ] Firebase project created
- [ ] Firebase credentials added to `.env.local`
- [ ] Phone authentication enabled in Firebase
- [ ] Test phone number added (optional)
- [ ] Dev server restarted
- [ ] Contact number field filled (10 digits)
- [ ] "Get OTP" button clicked
- [ ] Modal opens
- [ ] OTP sent successfully
- [ ] Timer starts at 30 seconds
- [ ] Timer counts down correctly
- [ ] Resend button disabled during countdown
- [ ] OTP entered (6 digits)
- [ ] OTP verified successfully
- [ ] Success toast appears
- [ ] Modal closes
- [ ] Console shows verification data

---

## 🆘 Need Help?

If you encounter any issues:

1. Check browser console for errors
2. Check Firebase Console → Authentication → Users (should see phone number after verification)
3. Check Firebase Console → Authentication → Usage (to see quota)
4. Review `FIREBASE_SETUP_GUIDE.md` for detailed setup
5. Review `FIREBASE_QUICK_START.md` for quick reference

---

## 🎉 Success Indicators

You'll know it's working when you see:

1. ✅ Green success toast: "OTP sent successfully!"
2. ✅ Timer counting down: "Resend OTP in 30s"
3. ✅ Green success toast: "Phone number verified successfully!"
4. ✅ Console log: "OTP Verified! Ready to submit form with data: {...}"
5. ✅ Modal closes automatically

**Happy Testing! 🚀**
