const mongoose = require('mongoose');

const travelGuideSchema = new mongoose.Schema({
    monasteryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Monastery',
        required: true
    },
    monasteryName: {
        type: String,
        required: true
    },
    
    // Location data
    coordinates: {
        latitude: Number,
        longitude: Number
    },
    address: {
        formatted: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    
    // Nearby hotels with distance
    hotels: [{
        placeId: String,
        name: String,
        address: String,
        rating: Number,
        userRatingsTotal: Number,
        priceLevel: Number,
        photoReference: String,
        coordinates: {
            lat: Number,
            lng: Number
        },
        distance: {
            value: Number, // meters
            text: String // e.g., "2.5 km"
        },
        duration: {
            value: Number, // seconds
            text: String // e.g., "10 mins"
        },
        contact: {
            phone: String,
            website: String
        },
        amenities: [String],
        openNow: Boolean
    }],
    
    // Nearby attractions
    nearbyAttractions: [{
        name: String,
        type: String,
        distance: String,
        rating: Number,
        placeId: String
    }],
    
    // Transportation options
    transportation: {
        fromGangtok: {
            distance: String,
            duration: String,
            modes: [
                new mongoose.Schema({
                    type: String,
                    duration: String,
                    distance: String,
                    cost: String
                }, { _id: false })
            ]
        },
        fromNearestAirport: {
            airportName: String,
            distance: String,
            duration: String
        }
    },
    
    // Travel tips
    travelTips: {
        bestRoute: String,
        parkingAvailable: Boolean,
        publicTransport: String,
        accessibility: String,
        thingsToCarry: [String],
        localGuides: Boolean
    },
    
    // Weather data cache
    weather: {
        temperature: String,
        condition: String,
        lastUpdated: Date
    },
    
    // Best hotel recommendation (computed)
    recommendedHotel: {
        placeId: String,
        name: String,
        reason: String // Why recommended
    },
    
    // Cache metadata
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    cacheExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    },
    apiCallCount: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Index for efficient cache lookup
travelGuideSchema.index({ monasteryId: 1 }, { unique: true });
travelGuideSchema.index({ cacheExpiresAt: 1 });

// Method to check if cache is valid
travelGuideSchema.methods.isValidCache = function() {
    return this.cacheExpiresAt > new Date();
};

const TravelGuide = mongoose.model('TravelGuide', travelGuideSchema);

module.exports = TravelGuide;
