const express = require('express');
const guideRouter = express.Router();
const TouristGuideProfile = require('../models/touristGuideProfile');
const GuideSubscription = require('../models/guideSubscription');
const Monastery = require('../models/monastery');
const { userAuth } = require('../middlewares/auth');

// POST /guide/create - Create a new guide profile
guideRouter.post('/guide/create', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Check if user already has a guide profile
        const existingProfile = await TouristGuideProfile.findOne({ userId });
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: 'You already have a guide profile. Use update endpoint instead.'
            });
        }

        const {
            guideName,
            bio,
            experience,
            languages,
            specialization,
            contactInfo,
            profilePhoto,
            certificationImages,
            selectedMonasteries,
            pricing,
            availableDays
        } = req.body;

        // Validate required fields
        if (!guideName || !bio || experience === undefined || !contactInfo?.phone || !contactInfo?.email) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: guideName, bio, experience, contact info'
            });
        }

        if (!pricing?.hourlyRate || !pricing?.halfDayRate || !pricing?.fullDayRate) {
            return res.status(400).json({
                success: false,
                message: 'Pricing information is required (hourly, half-day, and full-day rates)'
            });
        }

        // Validate selected monasteries
        if (selectedMonasteries && selectedMonasteries.length > 0) {
            const monasteryIds = selectedMonasteries.map(m => m.monasteryId);
            const validMonasteries = await Monastery.find({ _id: { $in: monasteryIds } });
            if (validMonasteries.length !== monasteryIds.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Some selected monasteries are invalid'
                });
            }
        }

        // Create guide profile
        const guideProfile = new TouristGuideProfile({
            userId,
            guideName,
            bio,
            experience,
            languages: languages || ['English'],
            specialization: specialization || [],
            contactInfo,
            profilePhoto: profilePhoto || null,
            certificationImages: certificationImages || [],
            selectedMonasteries: selectedMonasteries || [],
            pricing,
            availableDays: availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            subscriptionStatus: 'pending' // Will be active after subscription payment
        });

        await guideProfile.save();

        res.status(201).json({
            success: true,
            message: 'Guide profile created successfully. Please complete subscription to activate.',
            data: guideProfile
        });

    } catch (error) {
        console.error('Error creating guide profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create guide profile',
            error: error.message
        });
    }
});

// POST /guide/subscribe - Create subscription for guide profile
guideRouter.post('/guide/subscribe', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const { planType, autopayDate, termsAccepted } = req.body;

        if (!termsAccepted) {
            return res.status(400).json({
                success: false,
                message: 'You must accept the terms and conditions'
            });
        }

        // Find guide profile
        const guideProfile = await TouristGuideProfile.findOne({ userId });
        if (!guideProfile) {
            return res.status(404).json({
                success: false,
                message: 'Guide profile not found. Create a profile first.'
            });
        }

        // Check if already has active subscription
        if (guideProfile.subscriptionId) {
            const existingSub = await GuideSubscription.findById(guideProfile.subscriptionId);
            if (existingSub && existingSub.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'You already have an active subscription'
                });
            }
        }

        // Calculate next renewal date
        const now = new Date();
        let nextRenewal = new Date(now);
        
        if (planType === 'monthly') {
            nextRenewal.setMonth(nextRenewal.getMonth() + 1);
        } else if (planType === 'quarterly') {
            nextRenewal.setMonth(nextRenewal.getMonth() + 3);
        } else if (planType === 'annual') {
            nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
        } else {
            nextRenewal.setMonth(nextRenewal.getMonth() + 1);
        }

        // Create subscription
        const subscription = new GuideSubscription({
            userId,
            guideProfileId: guideProfile._id,
            planType: planType || 'monthly',
            autopayDate: autopayDate || new Date().getDate(),
            autopayEnabled: true,
            nextRenewalDate: nextRenewal,
            lastPaymentDate: now,
            lastPaymentStatus: 'success', // Simulated payment success
            isActive: true,
            termsAccepted: true,
            termsAcceptedAt: now
        });

        await subscription.save();

        // Update guide profile
        guideProfile.subscriptionId = subscription._id;
        guideProfile.subscriptionStatus = 'active';
        await guideProfile.save();

        res.status(201).json({
            success: true,
            message: 'Subscription activated successfully! Your guide profile is now live.',
            data: {
                subscription,
                guideProfile
            }
        });

    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create subscription',
            error: error.message
        });
    }
});

// GET /guide/my-profile - Get logged-in user's guide profile
guideRouter.get('/guide/my-profile', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        
        const guideProfile = await TouristGuideProfile.findOne({ userId })
            .populate('subscriptionId')
            .populate('selectedMonasteries.monasteryId', 'name region imageUrl');

        if (!guideProfile) {
            return res.status(404).json({
                success: false,
                message: 'Guide profile not found'
            });
        }

        res.json({
            success: true,
            data: guideProfile
        });

    } catch (error) {
        console.error('Error fetching guide profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch guide profile',
            error: error.message
        });
    }
});

// PATCH /guide/update - Update guide profile
guideRouter.patch('/guide/update', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = req.body;

        // Don't allow updating certain fields directly
        delete updateData.userId;
        delete updateData.subscriptionId;
        delete updateData.subscriptionStatus;
        delete updateData.rating;
        delete updateData.reviews;
        delete updateData.totalBookings;
        delete updateData.totalViews;
        delete updateData.isVerified;

        // Validate monasteries if being updated
        if (updateData.selectedMonasteries && updateData.selectedMonasteries.length > 0) {
            const monasteryIds = updateData.selectedMonasteries.map(m => m.monasteryId);
            const validMonasteries = await Monastery.find({ _id: { $in: monasteryIds } });
            if (validMonasteries.length !== monasteryIds.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Some selected monasteries are invalid'
                });
            }
        }

        const guideProfile = await TouristGuideProfile.findOneAndUpdate(
            { userId },
            updateData,
            { new: true, runValidators: true }
        ).populate('selectedMonasteries.monasteryId', 'name region imageUrl');

        if (!guideProfile) {
            return res.status(404).json({
                success: false,
                message: 'Guide profile not found'
            });
        }

        res.json({
            success: true,
            message: 'Guide profile updated successfully',
            data: guideProfile
        });

    } catch (error) {
        console.error('Error updating guide profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update guide profile',
            error: error.message
        });
    }
});

// GET /guide/monastery/:monasteryId - Get all active guides for a specific monastery
guideRouter.get('/guide/monastery/:monasteryId', async (req, res) => {
    try {
        const { monasteryId } = req.params;

        // Find all guides who have this monastery in their selected list and have active subscription
        const guides = await TouristGuideProfile.find({
            'selectedMonasteries.monasteryId': monasteryId,
            subscriptionStatus: 'active',
            isVerified: true
        })
        .select('-reviews') // Exclude reviews for listing
        .sort({ 'rating.average': -1, totalBookings: -1 }); // Sort by rating and bookings

        res.json({
            success: true,
            count: guides.length,
            data: guides
        });

    } catch (error) {
        console.error('Error fetching guides for monastery:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch guides',
            error: error.message
        });
    }
});

// GET /guide/:id - Get specific guide details
guideRouter.get('/guide/:id', async (req, res) => {
    try {
        const guideProfile = await TouristGuideProfile.findById(req.params.id)
            .populate('selectedMonasteries.monasteryId', 'name region imageUrl')
            .populate('reviews.userId', 'firstName lastName photoUrl');

        if (!guideProfile) {
            return res.status(404).json({
                success: false,
                message: 'Guide not found'
            });
        }

        // Increment view count
        guideProfile.totalViews += 1;
        await guideProfile.save();

        res.json({
            success: true,
            data: guideProfile
        });

    } catch (error) {
        console.error('Error fetching guide details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch guide details',
            error: error.message
        });
    }
});

// POST /guide/:id/review - Add a review for a guide
guideRouter.post('/guide/:id/review', userAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;
        const userName = `${req.user.firstName} ${req.user.lastName}`;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const guideProfile = await TouristGuideProfile.findById(id);
        if (!guideProfile) {
            return res.status(404).json({
                success: false,
                message: 'Guide not found'
            });
        }

        // Check if user already reviewed this guide
        const existingReview = guideProfile.reviews.find(
            r => r.userId.toString() === userId.toString()
        );
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this guide'
            });
        }

        await guideProfile.addReview(userId, userName, rating, comment);

        res.json({
            success: true,
            message: 'Review added successfully',
            data: guideProfile
        });

    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add review',
            error: error.message
        });
    }
});

// GET /guide/subscription/details - Get subscription details for logged-in guide
guideRouter.get('/guide/subscription/details', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        
        const guideProfile = await TouristGuideProfile.findOne({ userId });
        if (!guideProfile || !guideProfile.subscriptionId) {
            return res.status(404).json({
                success: false,
                message: 'No subscription found'
            });
        }

        const subscription = await GuideSubscription.findById(guideProfile.subscriptionId);
        
        res.json({
            success: true,
            data: subscription
        });

    } catch (error) {
        console.error('Error fetching subscription details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscription details',
            error: error.message
        });
    }
});

// POST /guide/subscription/renew - Renew expired subscription
guideRouter.post('/guide/subscription/renew', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        
        const guideProfile = await TouristGuideProfile.findOne({ userId });
        if (!guideProfile || !guideProfile.subscriptionId) {
            return res.status(404).json({
                success: false,
                message: 'No subscription found'
            });
        }

        const subscription = await GuideSubscription.findById(guideProfile.subscriptionId);
        
        if (subscription.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Subscription is already active'
            });
        }

        // Renew subscription
        const now = new Date();
        let nextRenewal = new Date(now);
        
        if (subscription.planType === 'monthly') {
            nextRenewal.setMonth(nextRenewal.getMonth() + 1);
        } else if (subscription.planType === 'quarterly') {
            nextRenewal.setMonth(nextRenewal.getMonth() + 3);
        } else if (subscription.planType === 'annual') {
            nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
        }

        subscription.isActive = true;
        subscription.nextRenewalDate = nextRenewal;
        subscription.lastPaymentDate = now;
        subscription.lastPaymentStatus = 'success';
        subscription.failedAttempts = 0;
        subscription.suspendReason = 'none';
        subscription.suspendedAt = null;

        await subscription.save();

        // Update guide profile status
        guideProfile.subscriptionStatus = 'active';
        await guideProfile.save();

        res.json({
            success: true,
            message: 'Subscription renewed successfully',
            data: subscription
        });

    } catch (error) {
        console.error('Error renewing subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to renew subscription',
            error: error.message
        });
    }
});

// POST /guide/subscription/cancel - Cancel active subscription
guideRouter.post('/guide/subscription/cancel', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        
        const guideProfile = await TouristGuideProfile.findOne({ userId });
        if (!guideProfile || !guideProfile.subscriptionId) {
            return res.status(404).json({
                success: false,
                message: 'No subscription found'
            });
        }

        const subscription = await GuideSubscription.findById(guideProfile.subscriptionId);
        
        if (!subscription.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Subscription is already inactive'
            });
        }

        // Cancel subscription
        subscription.isActive = false;
        subscription.suspendReason = 'user_cancelled';
        subscription.suspendedAt = new Date();

        await subscription.save();

        // Update guide profile status
        guideProfile.subscriptionStatus = 'expired';
        await guideProfile.save();

        res.json({
            success: true,
            message: 'Subscription cancelled successfully',
            data: subscription
        });

    } catch (error) {
        console.error('Error cancelling subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel subscription',
            error: error.message
        });
    }
});

// DELETE /guide/delete - Delete guide profile (admin or owner only)
guideRouter.delete('/guide/delete', userAuth, async (req, res) => {
    try {
        const userId = req.user._id;
        
        const guideProfile = await TouristGuideProfile.findOne({ userId });
        if (!guideProfile) {
            return res.status(404).json({
                success: false,
                message: 'Guide profile not found'
            });
        }

        // Delete associated subscription if exists
        if (guideProfile.subscriptionId) {
            await GuideSubscription.findByIdAndDelete(guideProfile.subscriptionId);
        }

        await TouristGuideProfile.findByIdAndDelete(guideProfile._id);

        res.json({
            success: true,
            message: 'Guide profile deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting guide profile:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete guide profile',
            error: error.message
        });
    }
});

// GET /guide/all - Get all active guides (for admin or public listing)
guideRouter.get('/guide/all', async (req, res) => {
    try {
        const guides = await TouristGuideProfile.find({
            subscriptionStatus: 'active',
            isVerified: true
        })
        .select('-reviews')
        .populate('selectedMonasteries.monasteryId', 'name region')
        .sort({ 'rating.average': -1, totalBookings: -1 });

        res.json({
            success: true,
            count: guides.length,
            data: guides
        });

    } catch (error) {
        console.error('Error fetching all guides:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch guides',
            error: error.message
        });
    }
});

module.exports = guideRouter;
