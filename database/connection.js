const config = require('../config/keys');
const mongoose = require("mongoose");

mongoose.connect(config.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
}, (err) => {
    if (err)
        console.log(err.message)
    else
        console.log('MongoDB Successfully Connected ...');
});

module.exports = mongoose;