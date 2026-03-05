# Tourist Guide Subscription Feature

## Overview
This feature allows users to register as tourist guides and list themselves on monastery detail pages with a monthly subscription model, similar to the existing hotel/location listing feature.

## Features Implemented

### Backend (Node.js/Express/MongoDB)

#### New Models:

1. **TouristGuideProfile** (`src/models/touristGuideProfile.js`)
   - Stores complete guide profile information
   - Fields include: name, bio, experience, languages, specialization
   - Contact information (phone, email, WhatsApp)
   - Selected monasteries where guide wants to be listed
   - Pricing structure (hourly, half-day, full-day rates)
   - Rating and review system
   - Statistics tracking (views, bookings)
   - Verification status
   - Subscription reference and status

2. **GuideSubscription** (`src/models/guideSubscription.js`)
   - Manages subscription status and autopay settings
   - Tracks payment attempts and renewal dates
   - Supports multiple plan types (monthly, quarterly, annual)
   - Default pricing: ₹149/month
   - Links to guide profile

#### New Routes (`src/routes/guide.js`):

- `POST /guide/create` - Create new guide profile
- `POST /guide/subscribe` - Create subscription for guide
- `GET /guide/my-profile` - Get logged-in user's guide profile
- `PATCH /guide/update` - Update guide profile
- `GET /guide/monastery/:monasteryId` - Get all active guides for a monastery
- `GET /guide/:id` - Get specific guide details (increments view count)
- `POST /guide/:id/review` - Add review/rating for a guide
- `GET /guide/subscription/details` - Get subscription details
- `POST /guide/subscription/renew` - Renew expired subscription
- `POST /guide/subscription/cancel` - Cancel active subscription
- `DELETE /guide/delete` - Delete guide profile
- `GET /guide/all` - Get all active verified guides

#### Model Updates:

- **User Model** (`src/models/user.js`)
  - Added 'guide' to role enum (user, admin, guide)

- **App.js** (`src/app.js`)
  - Registered guide router

### Frontend (React/Vite)

#### New Pages:

1. **BecomeGuide** (`src/pages/BecomeGuide.jsx`)
   - Multi-step registration form
   - Step 1: Profile Information
     - Guide name, bio, experience
     - Contact info (phone, email, WhatsApp)
     - Languages spoken
     - Specialization areas
     - Pricing (hourly, half-day, full-day)
     - Available days
   - Step 2: Monastery Selection
     - Select monasteries where guide wants to be listed
     - Multiple selection with checkboxes
   - Step 3: Subscription
     - Choose plan (monthly, quarterly, annual)
     - Accept terms and conditions
     - Complete registration

2. **MyGuideProfile** (`src/pages/MyGuideProfile.jsx`)
   - Dashboard to manage guide profile
   - View statistics (rating, views, bookings, monasteries)
   - Profile details display
   - Subscription status and management
   - Actions:
     - Edit profile
     - Renew subscription (if expired)
     - Cancel subscription (if active)
     - Delete profile

#### Updated Pages:

1. **MonasteryDetail** (`src/pages/MonasteryDetail.jsx`)
   - New section: "Available Tourist Guides"
   - Displays all active, verified guides for the monastery
   - Shows guide info: photo, name, rating, bio, experience
   - Shows pricing, languages, contact information
   - Direct contact buttons (phone, email)

2. **Layout** (`src/components/Layout.jsx`)
   - Added "Guide Profile" navigation link for logged-in users

3. **App.jsx**
   - Added routes for `/become-guide` and `/my-guide-profile`

#### API Integration (`src/api.js`):

Added `guideAPI` object with all guide-related endpoints:
- Profile creation and management
- Subscription operations
- Fetching guides by monastery
- Review system

## User Flow

### Becoming a Guide:

1. User logs in
2. Navigates to "Become a Guide" page
3. Fills out profile information (Step 1)
4. Selects monasteries to be listed at (Step 2)
5. Chooses subscription plan and accepts terms (Step 3)
6. System creates profile and activates subscription
7. Profile becomes visible on selected monastery pages

### Managing Guide Profile:

1. Navigate to "Guide Profile" from navigation
2. View statistics and profile details
3. Edit profile to update information
4. Manage subscription (renew if expired, cancel if active)
5. Delete profile if no longer needed

### Visitor Experience:

1. User visits monastery detail page
2. Scrolls to "Available Tourist Guides" section
3. Views all active guides for that monastery
4. Sees guide ratings, experience, languages, pricing
5. Can contact guide directly via phone or email

## Subscription Model

### Plans:
- **Monthly**: ₹149/month
- **Quarterly**: ₹399/3 months (Save 11%)
- **Annual**: ₹1499/year (Save 16%)

### Features Included:
- Profile listing on selected monastery pages
- Customer reviews and ratings
- Direct contact information display
- Priority placement for top-rated guides
- Monthly analytics dashboard

### Visibility Rules:
- Guides are only visible when subscription is active
- Profile status must be 'active'
- Guide must be verified (admin verification)
- Selected monasteries must exist

## Rating & Review System

- Users can rate guides from 1-5 stars
- Users can leave text comments
- Average rating is calculated automatically
- Review count is tracked
- One review per user per guide

## Statistics Tracking

Guides can track:
- Total profile views
- Total bookings
- Average rating
- Number of reviews
- Number of monasteries listed

## Security & Validation

- User authentication required for all guide operations
- Profile ownership verified for updates/deletions
- Monastery IDs validated before selection
- Required fields enforced (name, bio, contact, pricing)
- Minimum bio length: 50 characters
- Minimum guide name length: 3 characters

## Future Enhancements

Potential features to add:
1. Guide availability calendar
2. Direct booking system through the platform
3. Payment gateway integration
4. Guide certification upload and verification
5. Multi-language support for profiles
6. Guide photo gallery
7. Tour packages/itineraries
8. Chat system between visitors and guides
9. Email notifications for subscription renewal
10. Advanced analytics dashboard
11. Guide badges and achievements
12. Automatic subscription renewal with payment gateway

## Database Schema

### TouristGuideProfile Schema:
```
{
  userId: ObjectId (ref: user),
  guideName: String,
  bio: String,
  experience: Number,
  languages: [String],
  specialization: [String],
  contactInfo: {
    phone: String,
    email: String,
    whatsapp: String
  },
  profilePhoto: String,
  certificationImages: [String],
  selectedMonasteries: [{
    monasteryId: ObjectId (ref: Monastery),
    monasteryName: String
  }],
  pricing: {
    hourlyRate: Number,
    halfDayRate: Number,
    fullDayRate: Number,
    currency: String
  },
  rating: {
    average: Number,
    count: Number
  },
  reviews: [{
    userId: ObjectId (ref: user),
    userName: String,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  totalBookings: Number,
  totalViews: Number,
  subscriptionId: ObjectId (ref: GuideSubscription),
  subscriptionStatus: Enum (active, expired, suspended, pending),
  availability: Enum (available, busy, unavailable),
  availableDays: [String],
  isVerified: Boolean,
  verifiedAt: Date,
  verifiedBy: ObjectId (ref: user),
  createdAt: Date,
  updatedAt: Date
}
```

### GuideSubscription Schema:
```
{
  userId: ObjectId (ref: user),
  guideProfileId: ObjectId (ref: TouristGuideProfile),
  planType: Enum (monthly, quarterly, annual),
  monthlyAmount: Number,
  autopayEnabled: Boolean,
  autopayDate: Number,
  nextRenewalDate: Date,
  lastPaymentDate: Date,
  lastPaymentAttemptDate: Date,
  lastPaymentStatus: Enum (pending, success, failed, none),
  failedAttempts: Number,
  isActive: Boolean,
  suspendReason: Enum (payment_failed, user_cancelled, admin_suspended, none),
  suspendedAt: Date,
  paymentMethodId: String,
  termsAccepted: Boolean,
  termsAcceptedAt: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /guide/create | Create guide profile | Yes |
| POST | /guide/subscribe | Subscribe as guide | Yes |
| GET | /guide/my-profile | Get my profile | Yes |
| PATCH | /guide/update | Update profile | Yes |
| GET | /guide/monastery/:id | Get guides for monastery | No |
| GET | /guide/:id | Get guide details | No |
| POST | /guide/:id/review | Add review | Yes |
| GET | /guide/subscription/details | Get subscription | Yes |
| POST | /guide/subscription/renew | Renew subscription | Yes |
| POST | /guide/subscription/cancel | Cancel subscription | Yes |
| DELETE | /guide/delete | Delete profile | Yes |
| GET | /guide/all | Get all active guides | No |

## Testing Checklist

- [ ] Create guide profile with all required fields
- [ ] Subscribe as a guide with different plan types
- [ ] View guide profile on monastery detail page
- [ ] Update guide profile information
- [ ] Add/remove monasteries from selection
- [ ] Cancel active subscription
- [ ] Renew expired subscription
- [ ] Add review for a guide
- [ ] View statistics on dashboard
- [ ] Delete guide profile
- [ ] Verify subscription status updates profile visibility
- [ ] Test error handling for invalid data
- [ ] Test authentication requirements

## Notes

- Payment gateway integration is simulated (lastPaymentStatus set to 'success')
- Admin verification system is in place but verification UI not implemented
- Profile photos and certification images support URLs (upload functionality to be added)
- WhatsApp integration is contact-only (no direct messaging)
