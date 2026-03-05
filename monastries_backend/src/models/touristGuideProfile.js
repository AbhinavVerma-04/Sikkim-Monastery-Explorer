const mongoose = require("mongoose");

const touristGuideProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true,
        index: true
    },
    guideName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3
    },
    bio: {
        type: String,
        required: true,
        maxLength: 1000
    },
    experience: {
        type: Number, // years of experience
        required: true,
        min: 0,
        max: 100
    },
    languages: {
        type: [String],
        required: true,
        default: ['English']
    },
    specialization: {
        type: [String],
        default: []
        // e.g., ['Buddhist Culture', 'History', 'Photography', 'Trekking']
    },
    contactInfo: {
        phone: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        whatsapp: {
            type: String,
            trim: true
        }
    },
    profilePhoto: {
        type: String,
        default: null // URL to profile photo
    },
    certificationImages: {
        type: [String],
        default: []
        // URLs to certification/license images
    },
    // Monasteries where guide wants to be listed
    selectedMonasteries: [{
        monasteryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Monastery',
            required: true
        },
        monasteryName: {
            type: String,
            required: true
        }
    }],
    // Pricing
    pricing: {
        hourlyRate: {
            type: Number,
            required: true,
            min: 0
        },
        halfDayRate: {
            type: Number,
            required: true,
            min: 0
        },
        fullDayRate: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    // Rating system
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        userName: String,
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Statistics
    totalBookings: {
        type: Number,
        default: 0
    },
    totalViews: {
        type: Number,
        default: 0
    },
    // Subscription reference
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GuideSubscription',
        default: null
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'expired', 'suspended', 'pending'],
        default: 'pending',
        index: true
    },
    // Availability
    availability: {
        type: String,
        enum: ['available', 'busy', 'unavailable'],
        default: 'available'
    },
    availableDays: {
        type: [String], // e.g., ['Monday', 'Tuesday', 'Wednesday']
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    // Verification status
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null
    }
}, {
    timestamps: true
});

// Index for efficient queries
touristGuideProfileSchema.index({ subscriptionStatus: 1, isVerified: 1 });
touristGuideProfileSchema.index({ 'selectedMonasteries.monasteryId': 1 });
touristGuideProfileSchema.index({ 'rating.average': -1 });

// Method to check if guide can be displayed (active subscription)
touristGuideProfileSchema.methods.isDisplayable = function() {
    return this.subscriptionStatus === 'active' && this.isVerified;
};

// Method to add a review
touristGuideProfileSchema.methods.addReview = function(userId, userName, rating, comment) {
    this.reviews.push({
        userId,
        userName,
        rating,
        comment,
        createdAt: new Date()
    });
    
    // Recalculate average rating
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
    
    return this.save();
};

const TouristGuideProfile = mongoose.model('TouristGuideProfile', touristGuideProfileSchema);

module.exports = TouristGuideProfile;
