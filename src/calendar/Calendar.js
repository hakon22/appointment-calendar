const Date_Times = require('../db/tables/Date_Times.js');

class Calendar {

  async getAdminDate(req, res) {
    try {
      const { dataValues: { role } } = req.user;
      if (role === 'admin') {
        const { date } = req.body;
        const data = await Date_Times.findOne({ where: { date } });
        if (data) {
          res.status(200).json(data.dataValues);
        } else {
          res.status(200).json({ code: 2 });
        }
      } else {
        res.status(401).json(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async setAdminDate(req, res) {
    try {
      const { dataValues: { role } } = req.user;
      if (role === 'admin') {
        const { date } = req.body; 
        const times = Object.values(req.body).reduce((acc, value) => {
          if (value !== date) {
            acc[value] = { userId: '' };
          }
          return acc;
        }, {});
        const data = await Date_Times.create({ date, time: [times] });
        console.log(data);
        if (data) {
          res.status(200).json(data.dataValues);
        } else {
          res.status(200).json({ code: 2 });
        }
      } else {
        res.status(401).json(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

const CalendarHandler = new Calendar();

module.exports = CalendarHandler;