const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,       
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },  
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save',async function() {
  if (!this.isModified('password') ) return;
    this.password =await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    
});

UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', UserSchema);
