const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Users = require('../db/tables/Users.js');
const { generateAccessToken, generateRefreshToken } = require('./tokensGen.js');
 
 
const optionsRefresh = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.KEY_REFRESH_TOKEN,
}
 
module.exports = passport => {
  passport.use(
    'jwt-refresh',
    new JwtStrategy(optionsRefresh, async ({ id, email }, done) => {
      try {
        const user = await Users.findOne({ where: { id } });
        if (user) {
          const token = generateAccessToken(id, email);
          const refreshToken = generateRefreshToken(id, email);
          user.token = token;
          user.refreshToken = refreshToken;
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