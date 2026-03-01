const express = require('express');
const travelGuideRouter = express.Router();
const TravelGuide = require('../models/travelGuide');
const Monastery = require('../models/monastery');
const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Helper function to fetch nearby hotels using Google Places API
async function fetchNearbyHotels(latitude, longitude, monasteryName) {
    try {
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
        const response = await axios.get(placesUrl, {
            params: {
                location: `${latitude},${longitude}`,
                radius: 10000, // 10km radius
                type: 'lodging',
                key: GOOGLE_MAPS_API_KEY
            }
        });

        if (!response.data.results) {
            return [];
        }

        // Get distance for each hotel
        const hotelsWithDistance = await Promise.all(
            response.data.results.slice(0, 10).map(async (hotel) => {
                const distance = await calculateDistance(
                    latitude,
                    longitude,
                    hotel.geometry.location.lat,
                    hotel.geometry.location.lng
                );

                return {
                    placeId: hotel.place_id,
                    name: hotel.name,
                    address: hotel.vicinity,
                    rating: hotel.rating || 0,
                    userRatingsTotal: hotel.user_ratings_total || 0,
                    priceLevel: hotel.price_level || 0,
                    photoReference: hotel.photos?.[0]?.photo_reference || null,
                    coordinates: {
                        lat: hotel.geometry.location.lat,
                        lng: hotel.geometry.location.lng
                    },
                    distance: distance,
                    openNow: hotel.opening_hours?.open_now || null
                };
            })
        );

        // Sort by distance (nearest first)
        hotelsWithDistance.sort((a, b) => a.distance.value - b.distance.value);

        return hotelsWithDistance;
    } catch (error) {
        console.error('Error fetching nearby hotels:', error.message);
        return [];
    }
}

// Helper function to calculate distance using Google Distance Matrix API
async function calculateDistance(lat1, lon1, lat2, lon2) {
    try {
        const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json`;
        const response = await axios.get(distanceUrl, {
            params: {
                origins: `${lat1},${lon1}`,
                destinations: `${lat2},${lon2}`,
                mode: 'driving',
                key: GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.rows[0]?.elements[0]?.status === 'OK') {
            return {
                value: response.data.rows[0].elements[0].distance.value,
                text: response.data.rows[0].elements[0].distance.text,
                duration: {
                    value: response.data.rows[0].elements[0].duration.value,
                    text: response.data.rows[0].elements[0].duration.text
                }
            };
        }

        // Fallback to Haversine formula if API fails
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        return {
            value: Math.round(distance * 1000), // meters
            text: distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`,
            duration: {
                value: Math.round((distance / 40) * 3600), // Assume 40km/h average
                text: `${Math.round((distance / 40) * 60)} mins`
            }
        };
    } catch (error) {
        console.error('Error calculating distance:', error.message);
        return { value: 0, text: 'N/A', duration: { value: 0, text: 'N/A' } };
    }
}

// Helper function to get place details
async function getPlaceDetails(placeId) {
    try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json`;
        const response = await axios.get(detailsUrl, {
            params: {
                place_id: placeId,
                fields: 'formatted_phone_number,website,url,opening_hours',
                key: GOOGLE_MAPS_API_KEY
            }
        });

        if (response.data.result) {
            return {
                phone: response.data.result.formatted_phone_number,
                website: response.data.result.website
            };
        }
        return {};
    } catch (error) {
        console.error('Error fetching place details:', error.message);
        return {};
    }
}

// Helper function to determine best hotel
function getBestRecommendation(hotels) {
    if (!hotels || hotels.length === 0) return null;

    // Score based on: rating (40%), distance (30%), reviews count (30%)
    const scoredHotels = hotels.map(hotel => {
        const ratingScore = (hotel.rating / 5) * 40;
        const distanceScore = Math.max(0, 30 - (hotel.distance.value / 1000) * 2); // Closer is better
        const reviewScore = Math.min(30, (hotel.userRatingsTotal / 100) * 30);
        
        return {
            ...hotel,
            score: ratingScore + distanceScore + reviewScore
        };
    });

    scoredHotels.sort((a, b) => b.score - a.score);
    const best = scoredHotels[0];

    let reason = `Rated ${best.rating}/5 with ${best.userRatingsTotal} reviews`;
    if (best.distance.value < 2000) {
        reason += `, very close (${best.distance.text})`;
    }

    return {
        placeId: best.placeId,
        name: best.name,
        reason: reason
    };
}

// GET /monasteries/:id/travel-guide - Get complete travel guide for a monastery
travelGuideRouter.get('/monasteries/:id/travel-guide', async (req, res) => {
    try {
        const monastery = await Monastery.findById(req.params.id);
        
        if (!monastery) {
            return res.status(404).json({
                success: false,
                message: 'Monastery not found'
            });
        }

        // Check if we have valid cached data
        let travelGuide = await TravelGuide.findOne({ monasteryId: monastery._id });
        
        if (travelGuide && travelGuide.isValidCache()) {
            return res.json({
                success: true,
                data: travelGuide,
                cached: true
            });
        }

        // Fetch fresh data from Google APIs
        const latitude = monastery?.coordinates?.latitude;
        const longitude = monastery?.coordinates?.longitude;

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            return res.status(200).json({
                success: true,
                data: {
                    monasteryId: monastery._id,
                    monasteryName: monastery.name,
                    hotels: [],
                    nearbyAttractions: monastery.nearbyAttractions || [],
                    transportation: {
                        fromGangtok: {
                            distance: 'Not available',
                            duration: 'Not available',
                            modes: []
                        }
                    },
                    travelTips: {
                        bestRoute: 'Please check local transport on arrival',
                        parkingAvailable: null,
                        publicTransport: 'Availability varies by season',
                        accessibility: 'Check locally before visiting',
                        thingsToCarry: ['Valid ID', 'Water bottle'],
                        localGuides: null
                    }
                },
                cached: false,
                message: 'Travel guide has limited details because coordinates are unavailable for this monastery.'
            });
        }

        const hotels = await fetchNearbyHotels(latitude, longitude, monastery.name);

        // Get recommended hotel
        const recommendedHotel = getBestRecommendation(hotels);

        // Transportation data (can be enhanced with real-time data)
        const distanceFromGangtok = calculateDistanceText(27.3314, 88.6138, latitude, longitude);
        
        const transportation = {
            fromGangtok: {
                distance: distanceFromGangtok,
                duration: 'Varies',
                modes: [
                    { 
                        type: 'Taxi', 
                        duration: '30-60 mins', 
                        distance: distanceFromGangtok,
                        cost: '₹800-1500' 
                    },
                    { 
                        type: 'Bus', 
                        duration: '45-90 mins', 
                        distance: distanceFromGangtok,
                        cost: '₹50-100' 
                    }
                ]
            },
            fromNearestAirport: {
                airportName: 'Pakyong Airport (PYG)',
                distance: '35 km',
                duration: '1-1.5 hours'
            }
        };

        // Create or update travel guide
        const travelGuideData = {
            monasteryId: monastery._id,
            monasteryName: monastery.name,
            coordinates: { latitude, longitude },
            hotels: hotels,
            recommendedHotel: recommendedHotel,
            transportation: transportation,
            travelTips: {
                bestRoute: `Via ${monastery.region === 'East Sikkim' ? 'Gangtok' : 'Pelling'}`,
                parkingAvailable: true,
                publicTransport: 'Limited buses available from main towns',
                accessibility: 'Moderate - some walking required',
                thingsToCarry: ['Warm clothes', 'Camera', 'Water bottle', 'Valid ID'],
                localGuides: true
            },
            lastUpdated: new Date(),
            cacheExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            apiCallCount: (travelGuide?.apiCallCount || 0) + 1
        };

        if (travelGuide) {
            // Update existing
            travelGuide = await TravelGuide.findByIdAndUpdate(
                travelGuide._id,
                travelGuideData,
                { new: true }
            );
        } else {
            // Create new
            travelGuide = new TravelGuide(travelGuideData);
            await travelGuide.save();
        }

        res.json({
            success: true,
            data: travelGuide,
            cached: false
        });

    } catch (error) {
        console.error('Travel guide error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating travel guide: ' + error.message
        });
    }
});

// Helper function to calculate distance text
function calculateDistanceText(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;
}

// GET /travel-guides/hotels/search - Search hotels near any location
travelGuideRouter.get('/travel-guides/hotels/search', async (req, res) => {
    try {
        const { latitude, longitude, radius = 10000 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        const hotels = await fetchNearbyHotels(
            parseFloat(latitude),
            parseFloat(longitude),
            'Search Location'
        );

        res.json({
            success: true,
            data: hotels
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching hotels: ' + error.message
        });
    }
});

// GET /travel-guides/cache/clear - Clear all cached travel guides (admin only)
travelGuideRouter.delete('/travel-guides/cache/clear', async (req, res) => {
    try {
        await TravelGuide.deleteMany({});
        res.json({
            success: true,
            message: 'All cached travel guides cleared'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error clearing cache: ' + error.message
        });
    }
});

module.exports = travelGuideRouter;
