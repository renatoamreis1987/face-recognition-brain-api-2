const redisClient = require("../controllers/signin").redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json("Unauthorized");
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json("Unauthorized");
    }
    console.log('You shall pass')
    return next();
  });
};


//This is just to check the user have

module.exports = {
    requireAuth: requireAuth
}