# Debugging & Using the Guide Feature

## Issue 1: Experience Validation ✅ FIXED
**Problem:** Schema limited experience to 50 years max
**Solution:** Updated `touristGuideProfile.js` to allow up to 100 years

## Issue 2: Guides Not Showing on Page

### Possible Causes:

1. **No guides have been created yet for that monastery**
2. **Guide profile creation failed** (you saw the validation error)
3. **Guide subscription status is not 'active'**
4. **Guide is not verified** (isVerified = false)

### How to Debug:

#### Check Browser Console
Open your browser's DevTools (F12) and look at the Console tab. You should see:
- `Guides response: {...}` - Shows what the backend returned
- `Guides state: [...]` - Shows the guides array

#### Check Backend
Test the API directly:
```bash
curl http://localhost:3777/guide/monastery/69a3cea9e9b0d19db3da37a5
```

This should return JSON with guides for that monastery.

### How to Create a Guide Profile (Step by Step):

1. **Login to your application**
   - Go to http://localhost:5173/login

2. **Navigate to "Become a Guide"**
   - Click "Guide Profile" in navigation OR
   - Go directly to http://localhost:5173/become-guide

3. **Step 1: Fill Profile Information**
   - Guide Name (min 3 chars)
   - Bio (min 50 chars)
   - Experience (0-100 years now) ✅
   - Phone & Email
   - Languages
   - Specialization (optional)
   - Pricing (all 3 required: hourly, half-day, full-day)
   - Available Days

4. **Step 2: Select Monasteries**
   - Check at least one monastery
   - Make sure to select monastery ID: `69a3cea9e9b0d19db3da37a5` if you want to see it there

5. **Step 3: Subscribe**
   - Choose plan type
   - Accept terms
   - Click "Complete Registration"

### Verification Checklist:

After creating a guide profile, verify:

```bash
# 1. Check if guide profile was created
curl -X GET http://localhost:3777/guide/my-profile \
  -H "Cookie: token=YOUR_TOKEN"

# 2. Check if there are any guides for the monastery
curl http://localhost:3777/guide/monastery/69a3cea9e9b0d19db3da37a5

# 3. Check all guides
curl http://localhost:3777/guide/all
```

### Why Guides Might Not Show:

The backend filters guides by these criteria:
```javascript
{
  'selectedMonasteries.monasteryId': monasteryId,
  subscriptionStatus: 'active',  // Must be 'active'
  isVerified: true                // Must be verified
}
```

**By default, `isVerified` is `false`** - You need to manually verify guides!

### Quick Fix: Verify a Guide Manually

#### Option 1: Through MongoDB
```javascript
// Connect to your MongoDB
use your_database_name

// Find and verify the guide
db.touristguideprofiles.updateOne(
  { userId: ObjectId("YOUR_USER_ID") },
  { 
    $set: { 
      isVerified: true,
      verifiedAt: new Date()
    } 
  }
)
```

#### Option 2: Update the Model (for testing)
Change the default in `touristGuideProfile.js`:
```javascript
isVerified: {
    type: Boolean,
    default: true  // Changed from false for testing
},
```

### Testing Guide Display:

1. Create a guide profile
2. Verify the guide (manually in DB or change default)
3. Make sure subscription status is 'active'
4. Visit the monastery page: http://localhost:5173/monastery/69a3cea9e9b0d19db3da37a5
5. Scroll to the bottom - you should see "Available Tourist Guides"

### Expected Backend Response:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "guideName": "John Doe",
      "bio": "...",
      "experience": 10,
      "languages": ["English", "Hindi"],
      "subscriptionStatus": "active",
      "isVerified": true,
      "selectedMonasteries": [
        {
          "monasteryId": "69a3cea9e9b0d19db3da37a5",
          "monasteryName": "..."
        }
      ],
      "pricing": {
        "hourlyRate": 500,
        "halfDayRate": 1500,
        "fullDayRate": 2500
      },
      "contactInfo": {
        "phone": "...",
        "email": "..."
      },
      "rating": {
        "average": 0,
        "count": 0
      }
    }
  ]
}
```

### Common Mistakes:

❌ Experience > 100 years (now fixed)
❌ Bio < 50 characters
❌ Not selecting any monasteries
❌ Not accepting terms
❌ Guide not verified (isVerified = false)
❌ Subscription not active
❌ Wrong monastery ID selected

### Debug the Frontend:

Open browser console and check:
1. Network tab - look for request to `/guide/monastery/...`
2. Console tab - look for "Guides response" and "Guides state" logs
3. Check if the array is empty: `[]` means no guides found

### Next Steps:

1. ✅ Backend validation is fixed (experience max = 100)
2. 🔄 Create a guide profile through the UI
3. 🔄 Verify the guide manually in database
4. 🔄 Check if guides appear on monastery page
5. 🔄 Check browser console for any errors

Need help? Check:
- Backend logs for errors
- Browser console for API responses
- MongoDB for actual data
