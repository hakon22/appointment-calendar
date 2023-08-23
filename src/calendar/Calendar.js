const Date_Times = require('../db/tables/Date_Times.js');

const isAdmin = (role) => role === 'admin';

class Calendar {

  async getDate(req, res) {
    try {
      const { dataValues: { role } } = req.user;
      if (isAdmin(role)) {
        const { date } = req.body;
        const data = await Date_Times.findOne({ where: { date } });
        if (data) {
          res.status(200).json({ data: data.dataValues });
        } else {
          res.status(200).json({ data: { date, time: '' } });
        }
      } else {
        res.status(401).json(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async setDate(req, res) {
    try {
      const { dataValues: { role } } = req.user;
      if (isAdmin(role)) {
        const { date } = req.body; 
        const time = Object.values(req.body).reduce((acc, value) => {
          if (value !== date) {
            acc[value] = { user: '' };
          }
          return acc;
        }, {});
        const data = await Date_Times.create({ date, time });
        if (data) {
          res.status(200).json(data.dataValues);
        }
      } else {
        res.status(401).json(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async changeTime(req, res) {
    try {
      const { dataValues: { role } } = req.user;
      if (isAdmin(role)) {
        const { time, oldTime, date } = req.body;
        const { dataValues } = await Date_Times.findOne({ where: { date } });
        const timeKeys = Object.keys(dataValues.time);
        if (timeKeys.includes(time)) {
          return res.status(200).json({ code: 2 });
        }
        const newTime = Object.entries(dataValues.time).sort((a, b) => {
          if (a[0] === oldTime) {
            a[0] = time;
          }
          return a[0].localeCompare(b[0]);
          }).reduce((acc, [key, value]) => {
            acc[key] = value;
          return acc;
          }, {});
        await Date_Times.update({ time: newTime }, { where: { date } });
        res.status(200).json({ time: newTime });
      } else {
        res.status(401).json(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async addNewTime(req, res) {
    try {
      const { dataValues: { role } } = req.user;
      if (isAdmin(role)) {
        const { date } = req.body;
        const { dataValues } = await Date_Times.findOne({ where: { date } });
        const timeKeys = Object.keys(dataValues.time);
        const time = Object.values(req.body).reduce((acc, value) => {
          if (value !== date) {
            acc[value] = { user: '' };
          }
          return acc;
        }, {});
        const postTimeValues = Object.keys(time);
        const coincidence = timeKeys.filter((key) => postTimeValues.indexOf(key) !== -1);
        if (!coincidence.length > 0) {
          const newTimeObject = { ...dataValues.time, ...time };
          const sortTimeObject = Object.entries(newTimeObject).sort((a, b) => a[0].localeCompare(b[0]));
          const newTime = sortTimeObject.reduce((acc, [key, value]) => {
            acc[key] = value;
          return acc;
          }, {});
          await Date_Times.update({ time: newTime }, { where: { date } });
          res.status(200).json({ time: newTime });
        } else {
          res.status(200).json({ code: 2, errorFields: coincidence });
        }
      } else {
        res.status(401).json(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async removeTime(req, res) {
    try {
      const { dataValues: { role } } = req.user;
      if (isAdmin(role)) {
        const { data } = req.body;
        console.log(data)
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

const CalendarHandler = new Calendar();

module.exports = CalendarHandler;