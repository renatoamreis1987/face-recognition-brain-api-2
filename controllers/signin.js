const jwt = require("jsonwebtoken");
const redis = require("redis");

//Setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (knex, bcrypt, req, res) => {
  const { email, password } = req.body;
  //Bellow the if statement is validation on server side
  if (!email || !password) {
    return Promise.reject("Incorrect form submission");
  }
  return knex
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return knex
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => user[0])
          .catch(err => Promise.reject("unable to get user"));
      } else {
        Promise.reject("Wrong Credentials");
      }
    })
    .catch(err => Promise.reject("Wrong Credentials"));
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized')
    } 
    return res.json({id: reply})
  })
};

const signToken = email => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, "JWT_SECRET", { expiresIn: "2 days" });
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const createSessions = user => {
  //JWT Token, return user
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: "true", userId: id, token };
    })
    .catch(console.log);
};

const signinAuthentication = (knex, bcrypt) => (req, res) => {
  const { authorization } = req.headers; //If the user already has the authorization set in the headers, they should be able to login
  return authorization
    ? getAuthTokenId(req, res) //If the user has authorization -> grab the token and allow to login
    : handleSignin(knex, bcrypt, req, res) //If there's not auth, to proceed with the login
        .then(data => {
          //HERE WE'LL GET THE USER FROM USER[0] ^^^ ABOVE ^^^
          return data.id && data.email
            ? createSessions(data)
            : Promise.reject(data);
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err)); //IF THERE IS ANY ERROR WE'LL GET IT FROM THE Promise.reject above!! ^^^
};

module.exports = {
  signinAuthentication: signinAuthentication,
  redisClient: redisClient
};
