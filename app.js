const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://0.0.0.0:27017/tp_secret_santa');

app.use(express.urlencoded());
app.use(express.json());

// configuration de la route User
const userRoute = require(`./routes/userRoute`);
app.use('/users', userRoute);

// Swagger configuration
const swagger = require('./swagger');
app.use('/api-docs', swagger.serveSwaggerUI, swagger.setupSwaggerUI);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});