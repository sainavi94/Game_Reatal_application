const mongoose = require('mongoose')


var userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        unique:true,
        type:String,
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,  
    },
    contactNumber:{
        type:String,
        required:true,
        unique:true,
    },
    userType:{
        type:String,
        enum:["Seller", "Gamer"],
        default:"Gamer",
    },
    wishlist: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        default: []
    },
    cart: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product' // Referencing the Product model
            },
            count: {
                type: Number,
                required: true
            },
            bookingStartDate: Date,
            bookingEndDate: Date
        }],
        default: []
    }
   
})


//Export the model
module.exports = mongoose.model('User', userSchema);