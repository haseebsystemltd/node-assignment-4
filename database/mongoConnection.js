const mongoose = require('mongoose');

exports.connect = () => {
    const connectionString = process.env.DB_CONNECTION_STRING
        .replace('$DB_USERNAME', process.env.DB_USERNAME)
        .replace('$DB_PASSWORD', process.env.DB_PASSWORD);

    mongoose.connect(connectionString).then(() => {
        console.log('connection successfull');
    }).catch((error) => {
        console.log(error);
    })
}