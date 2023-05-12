const mongoose = require('mongoose');

// const connectionString = process.env.CONNECTION_STRING;

// En attendant de faire du process.env.CONNECTION_STRING
const connectionString = "mongodb+srv://Alonajae:6nLCSGU3g3ZVCIxC@cluster0.rkztksf.mongodb.net/together";

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log('Database connected'))
    .catch(error => console.error(error));