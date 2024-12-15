const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  id:{
    type:String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  repairType: {
    type: String,
    required: true,
  },
  repairDate: {
    type: String,
    required: true,
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  completeAmount: {type: String},
  cardNumber: {
    type: String,
    required: true,
  },
  cardCvv: {
    type: String,
    required: true,
  },
  cardExpirationDate: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  additionalNotes: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: 'pending',
  },
  paymentId:{
    type: String
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Payment', paymentSchema);
