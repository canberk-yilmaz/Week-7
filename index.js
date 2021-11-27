const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const user = require('./router/user')

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/user', user)

dotenv.config()

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) {
        console.log(err)
    } else {
        console.log('Connected to database...')
    }
})

app.listen(process.env.PORT, err => {
    if (err) {
        console.log(err)
    } else {
        console.log(process.env.PORT + ' listening...')
    }
})