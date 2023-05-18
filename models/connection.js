const mongoose = require('mongoose');

// "mongodb+srv://Alonajae:6nLCSGU3g3ZVCIxC@cluster0.rkztksf.mongodb.net/together" pour Camille et Frédérique

const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log('Database connected'))
    .catch(error => console.error(error));