const express = require('express');
const bookingRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

// Book a tour for a monastery
bookingRouter.post('/booking/create', userAuth, async (req, res) => {
  try {
    const { monasteryId, monasteryName, visitDate, numberOfPeople, contactNumber } = req.body;
    const user = req.user;

    // Validate input
    if (!monasteryId || !visitDate || !numberOfPeople) {
      return res.status(400).json({ 
        success: false,
        message: 'Monastery, visit date and number of people are required' 
      });
    }

    // Create booking (In a real app, you'd save this to a Booking model)
    const booking = {
      bookingId: `BK${Date.now()}`,
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.emailId,
      monasteryId,
      monasteryName: monasteryName || 'Monastery',
      visitDate,
      numberOfPeople,
      contactNumber: contactNumber || 'Not provided',
      bookingDate: new Date(),
      status: 'Confirmed'
    };

    res.json({
      success: true,
      message: 'Tour booked successfully!',
      booking
    });

  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Booking failed: ' + err.message 
    });
  }
});

// Get user's bookings
bookingRouter.get('/bookings/my', userAuth, async (req, res) => {
  try {
    const user = req.user;
    
    // In a real app, fetch from database
    // For now, return sample data
    res.json({
      success: true,
      bookings: []
    });

  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Failed to fetch bookings: ' + err.message 
    });
  }
});

module.exports = bookingRouter;
