"use strict";

const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
    var LocationHistory = sequelize.define("LocationHistory", {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        submittedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
    return LocationHistory;
};