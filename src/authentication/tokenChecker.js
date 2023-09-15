const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Users = require('../db/tables/Users.js');
 
 
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.KEY_TOKEN,
}
 
module.exports = passport => {
  passport.use(
    new JwtStrategy(options, async ({ id }, done) => {
      try {
        const user = await Users.findOne({ where: { id } });
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch(e) {
        console.log(e);
      }
    })
  )
};