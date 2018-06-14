import mongoose from 'mongoose';


const Reset = mongoose.model('Reset', {
  order: String,
  parts: Array,
  created: { type: Date, default: Date.now },
});

export default Reset;
