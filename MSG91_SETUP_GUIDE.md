# 🚀 MSG91 OTP Integration - Complete Setup Guide

## ✅ What's Been Done

I've successfully integrated MSG91 for OTP verification with custom text support!

### **Files Created:**
- ✅ `/pages/api/send-otp.js` - API to send OTP
- ✅ `/pages/api/verify-otp.js` - API to verify OTP
- ✅ `/components/MSG91OTPVerification.jsx` - OTP component with 30s timer
- ✅ `.env.msg91.example` - Environment variables template

### **Files Updated:**
- ✅ `PropertyDetails.jsx` - Now uses MSG91 instead of Firebase

---

## 📋 SETUP STEPS

### **Step 1: Create MSG91 Account**

1. Go to: https://msg91.com/
2. Click **"Sign Up"**
3. Fill in your details and verify email/phone
4. You'll get **₹20-50 free credits** (100-250 SMS)

---

### **Step 2: Get Your Auth Key**

1. Login to: https://control.msg91.com/
2. Click **"API"** in left sidebar
3. Click **"Auth Key"**
4. **Copy your Auth Key** (looks like: `123456ABCDefghIJKLMnop789`)

---

### **Step 3: Create OTP Template**

1. Go to **"SMS"** → **"Templates"**
2. Click **"Create Template"**
3. Fill in:
   - **Template Name**: `Property_Verification_OTP`
   - **Template Type**: **Transactional**
   - **Message**: 
     ```
     Your OTP for Rishikesh Rent property verification is {#var#}. Valid for 5 minutes. Do not share with anyone. - Rishikesh Rent
     ```
4. Click **"Submit"**
5. **Copy the Template ID** once approved (usually instant)

---

### **Step 4: Add Environment Variables**

Add these to your `.env.local` file:

```env
# MSG91 Configuration
NEXT_PUBLIC_MSG91_AUTH_KEY=your_auth_key_here
NEXT_PUBLIC_MSG91_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_MSG91_SENDER_ID=MSGIND
```

**Replace with your actual values from MSG91 dashboard!**

---

### **Step 5: Restart Dev Server**

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🧪 TESTING

### **Test with Real Number:**

1. Open: http://localhost:3000/admin/property_extranet
2. Fill property form
3. Enter **Contact Number**: Your 10-digit number
4. Click **"Get OTP For Final Approval"**
5. Click **"Get OTP"** in modal
6. Check your phone for SMS
7. Enter the 6-digit OTP
8. Click **"Verify OTP"**
9. ✅ Success!

---

## 📱 SMS Template Customization

### **Your Current Template:**
```
Your OTP for Rishikesh Rent property verification is {#var#}. Valid for 5 minutes. Do not share with anyone. - Rishikesh Rent
```

### **Customize It:**

You can change the message in MSG91 Dashboard:
- Go to **SMS** → **Templates**
- Edit your template
- Change text as needed
- **Keep `{#var#}`** - this is where OTP appears
- Save and wait for approval

### **Examples:**

**Professional:**
```
Dear User, Your OTP for property verification at Rishikesh Rent is {#var#}. Valid for 5 mins. - Team Rishikesh Rent
```

**Short & Simple:**
```
{#var#} is your OTP for Rishikesh Rent. Valid for 5 minutes. Do not share.
```

**With Branding:**
```
Welcome to Rishikesh Rent! Your verification OTP is {#var#}. Expires in 5 mins. Happy house hunting!
```

---

## ⏱️ Features Included

✅ **30-Second Resend Timer**
- Shows countdown: "Resend OTP in 30s"
- Button disabled during countdown
- Auto-enables after 30 seconds

✅ **Custom SMS Text**
- Your branded message
- Professional appearance
- Customizable anytime

✅ **Error Handling**
- Invalid OTP
- Expired OTP
- Network errors
- Already verified

✅ **Loading States**
- "Sending OTP..."
- "Verifying..."
- Disabled buttons

✅ **Validation**
- 10-digit phone number
- 6-digit OTP
- Real-time validation

---

## 💰 Pricing

### **MSG91 Costs:**
- **Transactional SMS**: ₹0.15 - ₹0.25 per SMS
- **Free Credits**: ₹20-50 on signup
- **Test SMS**: 100-250 free messages

### **Cost Comparison:**
| Service | Cost per SMS | Free Tier |
|---------|-------------|-----------|
| MSG91 | ₹0.15-0.25 | ₹20-50 credits |
| Firebase | $0.01 (₹0.80) | 10,000/month |
| Twilio | ₹0.50-1.50 | $15 trial |

**MSG91 is cheapest for India!** 🎉

---

## 🔐 DLT Registration (Important!)

For sending SMS in India, you need DLT registration:

1. Go to MSG91 Dashboard → **DLT**
2. Follow the wizard
3. Register:
   - Entity ID
   - Template ID
   - Sender ID (e.g., "RSHKSH")
4. Takes 2-7 days for approval

**For Testing**: Use default templates while waiting for DLT approval.

---

## 🐛 Troubleshooting

### **Issue: "Failed to send OTP"**
**Solutions:**
- Check Auth Key in `.env.local`
- Verify Template ID is correct
- Ensure you have credits in MSG91 account
- Check MSG91 Dashboard → Logs for errors

### **Issue: "Invalid OTP"**
**Solutions:**
- Make sure you entered correct 6-digit code
- Check if OTP expired (5 minutes)
- Try resending OTP

### **Issue: "Template not found"**
**Solutions:**
- Verify Template ID in `.env.local`
- Check template is approved in MSG91 Dashboard
- Wait a few minutes after template creation

### **Issue: SMS not received**
**Solutions:**
- Check phone number is correct (10 digits)
- Verify you have credits in MSG91 account
- Check spam/blocked messages
- Try different phone number
- Check MSG91 Dashboard → Logs

---

## 📊 API Endpoints

### **Send OTP:**
```javascript
POST /api/send-otp
Body: { mobile: "1234567890" }
Response: { success: true, message: "OTP sent successfully!" }
```

### **Verify OTP:**
```javascript
POST /api/verify-otp
Body: { mobile: "1234567890", otp: "123456" }
Response: { success: true, message: "OTP verified successfully!" }
```

---

## 🔍 Console Logs

### **When OTP is sent:**
```
MSG91 Response: { type: 'success', message: 'OTP sent successfully' }
```

### **When OTP is verified:**
```
Phone verified: { phoneNumber: '+911234567890', verified: true }
OTP Verified! Ready to submit form with data: { ... }
```

---

## ✨ Next Steps

1. **Add your MSG91 credentials** to `.env.local`
2. **Restart dev server**
3. **Test OTP flow**
4. **Customize SMS template** (optional)
5. **Complete DLT registration** (for production)
6. **Uncomment form submission** in PropertyDetails.jsx

---

## 📚 Resources

- **MSG91 Dashboard**: https://control.msg91.com/
- **MSG91 Docs**: https://docs.msg91.com/
- **MSG91 API Reference**: https://docs.msg91.com/p/tf9GTextN/e/Oq4Vz6Qb/MSG91
- **DLT Registration**: https://www.dltconnect.com/

---

## 🎯 Success Checklist

- [ ] MSG91 account created
- [ ] Auth Key copied
- [ ] OTP template created
- [ ] Template ID copied
- [ ] Environment variables added to `.env.local`
- [ ] Dev server restarted
- [ ] Test OTP sent successfully
- [ ] 30-second timer working
- [ ] OTP verified successfully
- [ ] Console shows verification data

---

## 🎉 You're All Set!

MSG91 integration is complete with:
- ✅ Custom SMS text
- ✅ 30-second resend timer
- ✅ Professional error handling
- ✅ Loading states
- ✅ Validation
- ✅ Cost-effective (₹0.15-0.25 per SMS)

**Happy Coding! 🚀**
