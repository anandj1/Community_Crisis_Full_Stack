import mongoose from 'mongoose';

const crisisSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    address: String,
    lat: Number,
    lng: Number,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
  },
  status: {
    type: String,
    enum: ['reported', 'inProgress', 'resolved'],
    default: 'reported',
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: String,
    contentType: String
  }],
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a virtual getter for 'id' that returns _id as a string
crisisSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtuals are included when converting document to JSON
crisisSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Update the updatedAt timestamp on save
crisisSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add index for better query performance
crisisSchema.index({ reportedBy: 1, createdAt: -1 });

const Crisis = mongoose.model('Crisis', crisisSchema);

export default Crisis;