const Sequelize = require('sequelize');

const connection = new Sequelize('cookbook_db', 'root', 'root', {
    dialect: "mysql"
});

//use table for log in
const User = connection.define('user', {
    //id auto generated as primary key
    // username: {
    //     type: Sequelize.STRING,
    //     validate: {
    //         len: [1, 20]
    //     }
    // },
    // password: {
    //     type: Sequelize.STRING,
    //     validate: {
    //         len: [1, 20]
    //     }
    // }
});

connection.sync();