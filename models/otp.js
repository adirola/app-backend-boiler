"use strict";

module.exports = function (sequelize, DataTypes) {
    var Otp = sequelize.define("Otp", {
        mobile: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastRequested: {
            type: DataTypes.DATE,
        },
        count: {
            type: DataTypes.INTEGER
        }
    });
    return Otp;
};