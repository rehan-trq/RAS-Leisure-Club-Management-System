import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Create a new booking (members only)
router.post('/', authenticate, authorize(['member']), async (req, res) => {
  try {
    const { activityName, date, timeSlot, notes } = req.body;
    
    const booking = new Booking({
      memberId: req.user.userId,
      activityName,
      date,
      timeSlot,
      notes
    });

    await booking.save();
    
    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Get all bookings (staff and admin only)
router.get('/', authenticate, authorize(['staff', 'admin']), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('memberId', 'name email')
      .sort({ date: 1 });
    
    // Format the response to match frontend expectations
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      activityName: booking.activityName,
      date: booking.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      timeSlot: booking.timeSlot,
      status: booking.status,
      memberName: booking.memberId.name,
      memberEmail: booking.memberId.email,
      notes: booking.notes,
      createdAt: booking.createdAt
    }));
    
    res.json(formattedBookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get member's own bookings
router.get('/me', authenticate, authorize(['member']), async (req, res) => {
  try {
    const bookings = await Booking.find({ memberId: req.user.userId })
      .sort({ date: 1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Cancel a booking
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is authorized to cancel this booking
    if (booking.memberId.toString() !== req.user.userId && 
        !['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking is already canceled
    if (booking.status === 'canceled') {
      return res.status(400).json({ message: 'Booking is already canceled' });
    }

    // Check if booking is in the past
    const bookingDateTime = new Date(`${booking.date}T${booking.timeSlot}`);
    if (bookingDateTime < new Date()) {
      return res.status(400).json({ message: 'Cannot cancel past bookings' });
    }

    booking.status = 'canceled';
    await booking.save();

    // Format the response to match frontend expectations
    const formattedBooking = {
      _id: booking._id,
      activityName: booking.activityName,
      date: booking.date.toISOString().split('T')[0],
      timeSlot: booking.timeSlot,
      status: booking.status,
      memberName: booking.memberId.name,
      memberEmail: booking.memberId.email,
      notes: booking.notes,
      createdAt: booking.createdAt
    };

    res.json({
      message: 'Booking canceled successfully',
      booking: formattedBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error: error.message });
  }
});

export default router; 