const express = require('express');
const Repair = require('../model/repairDetails'); // Import the Repair model
const router = express.Router();

// POST route to create a new repair request
router.post('/schedule', async (req, res) => {
  try {
    const { id, repairType, repairDescription, repairDate, notes } = req.body;

    // Validate the input data
    if (!id || !repairType || !repairDescription || !repairDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new Repair record
    const newRepair = new Repair({
      id,
      repairType,
      repairDescription,
      repairDate,
      notes,
    });

    // Save the repair to the database
    const savedRepair = await newRepair.save();

    // Send the saved repair details as response
    res.status(201).json({
      message: 'Repair scheduled successfully!',
      repair: savedRepair,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});



module.exports = router;
