const Date_Times = require('../db/tables/Date_Times.js');

class Calendar {

  async getAdminDate(req, res) {
    try {
      const { dataValues: { role } } = req.user;
      if (role === 'admin') {
        const date = req.body;
        const { dataValues } = await Date_Times.findOne({ where: { date } });
        console.log(dataValues)
      } else {
        res.status(401).json(false);
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(401);
    }
  }
}

const CalendarHandler = new Calendar();

module.exports = CalendarHandler;