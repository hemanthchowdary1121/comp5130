const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema(
  {
    id:{
      type:String,
      required: true
    },
    repairType: {
      type: String,
      required: true,
    },
    repairDescription: {
      type: String,
      required: true,
    },
    repairDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed'],
      default: 'Scheduled',
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

// Add a TTL index on repairDate with a 0 seconds expiration time
repairSchema.index({ repairDate: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model('Repair', repairSchema);
