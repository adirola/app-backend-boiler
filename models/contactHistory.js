"use strict";

const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
    var ContactHistory = sequelize.define("ContactHistory", {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        contactedUserBeaconId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        duration: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        startTime: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        maxSignal: {
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
    return ContactHistory;
};