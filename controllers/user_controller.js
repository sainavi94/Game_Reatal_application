const express = require('express')
const User = require('../models/user_Model')



// To create a user
const createUser = async(req, res) => {
    const { username, email, password, firstName, lastName, contactNumber, userType } = req.body;

    // Check if all required fields are provided
    const requiredFields = await ['username', 'email', 'password', 'firstName', 'lastName', 'contactNumber', 'userType'];
    const missingFields = await requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({ message: `Please provide ${missingFields.join(', ')}`,status: 'FAILURE', statusCode: 400 });
    }

    // Check if the user is a seller and has a valid email domain
    if (userType === 'Seller' && !email.endsWith('@admin.com')) {
        return res.status(400).json({ message: 'Sellers can only register with an email address with the admin domain.', status: 'FAILURE', statusCode: 400 });
    }

    try {
        // Create a new user
        const newUser = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            contactNumber,
            userType
        });

        // Save the user to the database
        await newUser.save();

        // Return success response
        return res.status(200).json({
            status: 'SUCCESS', 
            statusCode: 200,
           data: newUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', status: 'FAILURE', statusCode: 500})
    }
};
// User Login
const userLogin = async (req, res)=>{
    const { username, password } = req.body;

    try {
        // Check if user exists in the database
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(400).json({ message: "Invalid Login Credentials",status: 'FAILURE', statusCode: 400 });
        }

        // Check if the password matches
        if (user.username !== username && user.password !== password ) {
            return res.status(400).json({ message: "Invalid Login Credentials",status: 'FAILURE', statusCode: 400 });
        }

        // Return success response with userId
        res.status(200).json({ 
            status: 'SUCCESS', 
            statusCode: 200,
            data: {userId: user._id, message: "Login Successful" }});
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error", status: 'FAILURE', statusCode: 500 });
    }
};
// View User by userID
const getaUser = async (req, res) => {
    const username = req.params.username;
    try {
      // Find the user by username
      const user = await User.findOne({ username });
  
      if (!user) {
        // If user not found, return 404
        return res.status(404).json({ error: 'User not found',status: 'FAILURE', statusCode: 400  });
      }
  
      // If user found, return user details
      res.status(200).json({
        status: 'SUCCESS', 
        statusCode: 200,
        data:{
            userID: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            contactNumber: user.contactNumber,
            userType: user.userType
        }     
      });
    } catch (error) {
      // If an error occurs, return 400 with error message
      res.status(400).json({ error: 'Bad Request',status: 'FAILURE', statusCode: 400  });
    }
  };

// Update User details

  const updateUserDetails = async (req, res) => {
    try {
    const { userID } = req.params;
    const { firstName, lastName, email, contactNumber, userType } = req.body;
  
      // Validate request data
      if ( !firstName || !lastName || !email || !contactNumber || !userType) {
        return res.status(400).json({ error: 'Missing required fields',status: 'FAILURE', statusCode: 400 });
      }
  
      // Find user by userID
      const user = await User.findByIdAndUpdate({ _id: userID });
  
      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: 'User not found',status: 'FAILURE', statusCode: 404 });
      }
  
      // Update user details
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.contactNumber = contactNumber;
      user.userType = userType;
  
      // Save updated user
      await user.save();
  
      // Send success response with updated user details
      res.status(200).json({
        status: 'SUCCESS', 
        statusCode: 200,
       data: {
        userID: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        userType: user.userType
       }
        
      });
    } catch (error) {
      // Send error response
      console.error(error);
      res.status(400).json({ error: 'Failed to update user details',status: 'FAILURE', statusCode: 400});
    }
  };



module.exports = {
    createUser, userLogin, getaUser, updateUserDetails,
}



