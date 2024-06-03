const express = require('express');
const { createUser, userLogin, getaUser, updateUserDetails } = require('../controllers/user_controller');

const router = express.Router();


router.post('/register', createUser);
router.post('/login', userLogin);
router.get('/:username', getaUser);
router.put('/:userID', updateUserDetails)





module.exports = router;
