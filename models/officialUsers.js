"use strict";

const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
    var officialUser = sequelize.define("officialUser", {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roles: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        password: {
            type: DataTypes.STRING 
        }
    });
    return officialUser;
};