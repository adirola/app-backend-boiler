"use strict";
const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
    var Announcements = sequelize.define("Announcements", {
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
        source: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        source_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        date: {
            type: DataTypes.BIGINT,
        }
    });
    return Announcements;
};