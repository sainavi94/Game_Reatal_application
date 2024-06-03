const express = require('express');
const dbConnect = require('./config/database');
const { db } = require('./models/user_Model');
const app = express();
const dotenv = require('dotenv').config();
const authRoute = require('./Routes/authRoute');
const product_Route = require('./Routes/product_Route');

const PORT = 5000;
dbConnect();

app.use(express.json());



app.use('/api/', authRoute);
app.use('/api/product', product_Route);




app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});