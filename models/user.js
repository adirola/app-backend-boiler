"use strict";

const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
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
            allowNull: true,
        },
        pushTokens: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        covidStatus: {
            type: DataTypes.STRING 
        },
        qurrantineStatus: {
            type: DataTypes.STRING 
        },
        infectionStatus :{
            type: DataTypes.STRING
        },
        abiding:{
            type: DataTypes.STRING
        },
        symptoms:{
            type: DataTypes.ARRAY(DataTypes.STRING) 
        }
    });
    return User;
};