const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    monasteryName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    region: {
        type: String,
        required: true,
        enum: ['East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim']
    },
    description: {
        type: String,
        required: true,
        minLength: 50
    },
    established: {
        type: Number,
        min: 1000,
        max: new Date().getFullYear()
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    imageUrl: {
        type: String
    },
    additionalInfo: {
        type: String
    },
    
    // Contributor information
    contributedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    contributorName: {
        type: String,
        required: true
    },
    contributorEmail: {
        type: String,
        required: true
    },
    
    // Status tracking
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    
    // Admin review
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    reviewedAt: {
        type: Date
    },
    reviewNotes: {
        type: String
    },
    
    // Reward tracking
    pointsAwarded: {
        type: Number,
        default: 0
    },
    rewardClaimed: {
        type: Boolean,
        default: false
    },
    
    // Verification data
    verificationSource: {
        type: String // e.g., "Google Maps", "Wikipedia", "Official Website"
    },
    verifiedImageUrl: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient querying
contributionSchema.index({ status: 1, createdAt: -1 });
contributionSchema.index({ contributedBy: 1 });

const Contribution = mongoose.model('Contribution', contributionSchema);

module.exports = Contribution;
