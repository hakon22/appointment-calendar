const Date_Times = require('../db/tables/Date_Times.js');
const { sendMailCancelRecording, sendMailRecordingSuccess } = require('../mail/sendMail.js');

const isAdmin = (role) => role === 'admin';

class Calendar {

  async getDate(req, res) {
    try {
      const { dataValues: { role } } = req.user;
      const { date } = req.body;
      const data = await Date_Times.findOne({ where: { date } });
      if (data) {
        if (isAdmin(role)) {
          res.status(200).json({ data: data.dataValues });
        } else {
          const processedData = Object.entries(data.dataValues.time)
          .reduce((acc, [key, { user }]) => {
            if (user) {
              acc[key] = true;
            } else {
              acc[key] = false;
            }
            return acc;
          }, {});
          res.status(200).json({ data: { date: data.dataValues.date, time: processedData } });
        }
      } else {
        res.status(200).json({ data: { date, time: '' } });
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
            acc[value] = false;
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
        const timeEntries = Object.entries(dataValues.time);
        const newTime = timeEntries.length > 1
        ? timeEntries
          .sort((a, b) => {
            if (a[0] === oldTime) {
              a[0] = time;
            }
            if (b[0] === oldTime) {
              b[0] = time;
            }
            return a[0].localeCompare(b[0]);
          })
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
            }, {})
        : { [time]: timeEntries[0][1] };
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
            acc[value] = false;
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
        const { date, time } = req.query;
        const { dataValues } = await Date_Times.findOne({ where: { date } });
        if (!dataValues.time.hasOwnProperty(time[0])) {
          return res.status(200).json({ code: 2 });
        } else {
          const { user } = dataValues.time[time[0]];
          if (user) {
            // await sendMailCancelRecording(user.username, user.email, time[1], time[0]);
          }
          const timeEntries = Object.entries(dataValues.time);
          const newTime = timeEntries.length > 1
          ? Object.entries(dataValues.time).reduce((acc, [key, value]) => {
              if (key !== time[0]) {
              acc[key] = value;
              }
              return acc;
            }, {})
          : '';
          newTime
          ? await Date_Times.update({ time: newTime }, { where: { date } })
          : await Date_Times.destroy({ where: { date } });
          res.status(200).json({ time: newTime });
        }
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async removeDate(req, res) {
    try {
      const { dataValues: { role } } = req.user;
      if (isAdmin(role)) {
        const { date, time } = req.query;
        const data = await Date_Times.findOne({ where: { date } });
        const { dataValues } = data ?? '';
        if (dataValues) {
          Object.entries(dataValues.time).forEach(async ([key, { user }]) => {
            if (user) {
              // await sendMailCancelRecording(user.username, user.email, time, key);
            }
          });
          await Date_Times.destroy({ where: { date } });
          res.status(200).json({ code: 1 });
        } else {
          res.status(200).json({ code: 2 });
        }
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }

  async recording(req, res) {
    try {
      const { dataValues: { id, username, email, phone } } = req.user;
      const { date, stringDate, time } = req.body;
      const data = await Date_Times.findOne({ where: { date } });
      const { dataValues } = data ?? '';
      if (dataValues) {
        if (dataValues.time[time] !== undefined) {
          dataValues.time[time] = { user: { id, username, email, phone } };
          await Date_Times.update({ time: dataValues.time }, { where: { date } });
          res.status(200).json({ code: 1 });
          // await sendMailRecordingSuccess(username, email, stringDate, time);
        } else {
          res.status(200).json({ code: 2 });
        }
      } else {
        res.status(200).json({ code: 3 });
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
}

const CalendarHandler = new Calendar();

module.exports = CalendarHandler;