"use strict";

const Sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {
    var Test = sequelize.define("Test", {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        submittedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        declaredAt: {
            type: DataTypes.DATE
        },
        result: {
            type: DataTypes.STRING
        }
    });
    return Test;
};