const { DataTypes } = require('sequelize');
const { db } = require('../connect.js');

const Users = db.define(
  'Users',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
  },
);

module.exports = Users;