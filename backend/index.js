const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');

dotenv.config();

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>{
        console.log('MongoDB Connected!')
    })
    .catch((err) => console.log(err));


app.use("/api/pins",pinRoute);
app.use("/api/users",userRoute);

const PORT = process.env.PORT || 8800;

app.listen(PORT, ()=>{
    console.log(`Backend server is running on port ${PORT}`)
});