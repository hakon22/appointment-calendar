const { DataTypes } = require('sequelize');
const { db } = require('../connect.js');

const Date_Times = db.define(
  'Date_Times',
  {
    date: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    time: {
      type: DataTypes.ARRAY(DataTypes.JSONB), 
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = Date_Times;