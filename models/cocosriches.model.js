const {DataTypes} = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const CocosRiches = sequelize.define("cocosriches", {
        gameCode: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        pType: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        gameDone: DataTypes.BOOLEAN,
        idx: {
            type: DataTypes.STRING(22),
            allowNull: true
        },
        big: DataTypes.INTEGER,
        small: DataTypes.INTEGER,
        win: {
            type: DataTypes.FLOAT(53),
            allowNull: false
        },
        totalWin: {
            type: DataTypes.FLOAT(53),
            allowNull: false
        },
        totalBet: {
            type: DataTypes.FLOAT(53),
            allowNull: false
        },
        virtualBet: {
            type: DataTypes.FLOAT(53),
            allowNull: false
        },
        rtp: {
            type: DataTypes.FLOAT(53),
            allowNull: true
        },
        balance: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        pattern: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        timestamps: true
    });

    return CocosRiches;
};
