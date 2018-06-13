import mongoose from 'mongoose';


const Rename = mongoose.model('Rename', {
  original: String,
  new: String,
  parts: Array,
  created: { type: Date, default: Date.now },
});

export default Rename;
