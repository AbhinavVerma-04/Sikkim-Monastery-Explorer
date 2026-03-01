const mongoose = require("mongoose");

const monasterySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        index: true
    },
    location: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    locationText: {
        type: String,
        default: '',
        index: true
    },
    region: {
        type: String,
        required: true,
        enum: ['East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim'],
        index: true
    },
    description: {
        type: String,
        required: true,
        minLength: 50
    },
    link: {
        type: String,
        default: null
    },
    dataAvailable: {
        type: Boolean,
        default: true
    },
    established: {
        type: Number,
        default: null
    },
    foundedBy: {
        type: String,
        default: null
    },
    sect: {
        type: String,
        default: null
    },
    architectureStyle: {
        type: String,
        default: null
    },
    imageUrl: {
        type: String,
        required: true
    },
    features: {
        type: [String],
        default: []
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    visitors: {
        type: Number,
        default: 0,
        min: 0
    },
    openingHours: {
        type: String,
        default: "6:00 AM - 6:00 PM"
    },
    entryFee: {
        type: String,
        default: "Free"
    },
    bestTimeToVisit: {
        type: String,
        default: "October to May"
    },
    contact: {
        phone: String,
        email: String
    },
    nearbyAttractions: {
        type: [String],
        default: []
    },
    coordinates: {
        latitude: {
            type: Number,
            default: null
        },
        longitude: {
            type: Number,
            default: null
        }
    },
    history: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    architecture: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    monks: {
        type: Number,
        default: null
    },
    festivals: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    deitiesWorshipped: {
        type: [String],
        default: []
    },
    culturalSignificance: {
        type: String,
        default: null
    },
    restoration: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    earthquakeDamage: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    infrastructure: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    altitude: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Calculate age based on established year
monasterySchema.virtual('age').get(function() {
    if (!this.established) return null;
    return new Date().getFullYear() - this.established;
});

// Ensure virtuals are included when converting to JSON
monasterySchema.set('toJSON', { virtuals: true });
monasterySchema.set('toObject', { virtuals: true });

// Keep a searchable plain-text location copy regardless of location object/string shape
monasterySchema.pre('save', function(next) {
    if (typeof this.location === 'string') {
        this.locationText = this.location;
    } else if (this.location && typeof this.location === 'object') {
        const values = Object.values(this.location).filter((v) => typeof v === 'string' && v.trim());
        this.locationText = values.join(', ');
    } else {
        this.locationText = '';
    }
    next();
});

// Text index for search functionality
monasterySchema.index({ 
    name: 'text', 
    description: 'text', 
    features: 'text',
    locationText: 'text'
});

module.exports = mongoose.model('Monastery', monasterySchema);
