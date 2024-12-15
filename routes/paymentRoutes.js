const express = require('express');
const CryptoJS = require('crypto-js');  // To handle encryption and decryption
const Payment = require('../model/paymentDetail');  // Import the Payment model
const router = express.Router();
const crypto = require('crypto');

// Secret key for encryption/decryption (store securely in production)
const SECRET_KEY = process.env.SECRET_KEY; // Use environment variable in production

// POST request to handle the payment and store data in the database
router.post('/payment', async (req, res) => {
  const { id, depositAmount, userName, completeAmount, cardNumber, cardCvv, cardExpirationDate, address, additionalNotes, repairType, repairDate } = req.body;

  // Validate inputs
  if (!id || !depositAmount ||!userName || !cardNumber || !cardCvv || !cardExpirationDate || !address || !additionalNotes || !repairType || !repairDate) {
    return res.status(400).send('Please fill in all the required fields.');
  }

  try {

    const randomBytes = crypto.randomBytes(12);

  // Convert it to a 16-character string using Base36 (0-9, a-z)
  const uniqueString = randomBytes.toString('hex').slice(0, 16);

    // Encrypt the card details using CryptoJS (AES encryption)
    const encryptedCardNumber = CryptoJS.AES.encrypt(cardNumber, SECRET_KEY).toString();
    const encryptedCardCvv = CryptoJS.AES.encrypt(cardCvv, SECRET_KEY).toString();

    // Create a new payment record in the database
    const newPayment = new Payment({
      id, 
      depositAmount,
      completeAmount,
      userName,
      cardNumber: encryptedCardNumber,   // Store encrypted card number
      cardCvv: encryptedCardCvv,         // Store encrypted CVV
      cardExpirationDate,
      address,
      additionalNotes,
      repairType,
      repairDate,
      paymentId: uniqueString
    });

    // Save the payment details to the database
    await newPayment.save();

    // Respond with a success message
    res.status(200).json({
      message: 'Payment details stored successfully',
      paymentId: newPayment.paymentId, // Send the payment ID for reference
      repairType,
      repairDate,
      depositAmount,
      address,
      additionalNotes,
    });
  } catch (error) {
    // Catch any errors that occur during saving
    console.error('Error saving payment details:', error);
    res.status(500).send('There was an error processing your payment details. Please try again.');
  }
});


// GET route to get all scheduled repairs (for admins or users to see their own repairs)
router.get('/repairs/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    // Optional: You can filter repairs by user ID (if logged in)
    const repairs = await Payment.find({id}); // Or use { userId: req.user.id } for logged-in users

    if (repairs.length > 0) { res.status(200).json({ repairs });} else {res.status(404).json({ message: 'No repairs found for this user' });}
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// Route to update the completeAmount for a specific repair
router.patch('/update-complete-amount/:id', async (req, res) => {
  const { id } = req.params; // Extract the repair ID from the URL
  const { completeAmount } = req.body; // The new completeAmount value from the request body

  try {
    // Validate the input
    if (!completeAmount || isNaN(completeAmount)) {
      return res.status(400).json({ message: 'Invalid or missing completeAmount value' });
    }

    // Find the repair by ID and update the completeAmount field
    const updatedRepair = await Payment.findByIdAndUpdate(
      id,
      { completeAmount },
      { new: true } // Return the updated document
    );

    // If the repair isn't found, return a 404 error
    if (!updatedRepair) {
      return res.status(404).json({ message: 'Repair not found' });
    }

    // Respond with the updated document
    res.status(200).json({
      message: 'Complete amount updated successfully',
      repair: updatedRepair,
    });
  } catch (error) {
    console.error('Error updating completeAmount:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/updatePayment/:paymentId', async (req, res) => {
  const { paymentId } = req.params;
  const { paymentStatus, completeAmount } = req.body;

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { paymentId },
      { paymentStatus, completeAmount },
      { new: true } // Return the updated document
    );

    if (updatedPayment) {
      res.status(200).json({ message: 'Payment updated successfully', updatedPayment });
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
