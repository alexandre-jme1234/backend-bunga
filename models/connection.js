const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://infoabde:Mongodb2-@capsule.uvsqdnq.mongodb.net/bungaData';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
