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

const getAuthTokenId = () => {
  console.log("auth");
};
const signinAuthentication = (knex, bcrypt) => (req, res) => {
  const { authorization } = req.headers; //If the user already has the authorization set in the headers, they should be able to login
  return authorization
    ? getAuthTokenId() //If the user has authorization -> grab the token and allow to login
    : handleSignin(knex, bcrypt, req, res) //If there's not auth, to proceed with the login
        .then(data => res.json(data))
        .catch(err => res.status(400).json(err))
};

module.exports = {
  signinAuthentication: signinAuthentication
};
