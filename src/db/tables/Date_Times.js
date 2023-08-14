const { DataTypes } = require('sequelize');
const { db } = require('../connect.js');

const Date_Times = db.define(
  'Date_Times',
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    open_time: {
      type: DataTypes.ARRAY(DataTypes.TIME),
      allowNull: false,
    },
    close_time: {
      type: DataTypes.ARRAY(DataTypes.TIME),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = Date_Times;