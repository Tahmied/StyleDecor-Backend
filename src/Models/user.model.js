const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false, 
  },
  image: {
    type: String, 
    default: "" 
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'decorator'],
    default: 'user'
  },
  specialty: {
    type: String,
    enum: ['Wedding', 'Birthday', 'Corporate', 'Home', 'All'],
    default: 'All'
  },
  rating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isVerified: { 
    type: Boolean, 
    default: false
  },
  earnings: {
    type: Number,
    default: 0 
  }
}, { timestamps: true });


UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});



UserSchema.methods.isPassCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
}



export const User = mongoose.model('User', UserSchema)