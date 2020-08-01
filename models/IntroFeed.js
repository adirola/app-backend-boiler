"use strict";
const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
    var IntroFeed = sequelize.define("IntroFeed", {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        deepLink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    return IntroFeed;
};