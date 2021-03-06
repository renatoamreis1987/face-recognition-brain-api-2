const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const morgan = require("morgan");
const knex = require("knex")({
  client: "pg",
  connection: process.env.POSTGRES_URI
});

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");
const auth = require("./middleware/authorization");

const app = express();

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("This is my world");
});

//IMPORTANT: Bellow with signin and also inside of signin.js is written in a different
//way, to have the code in a cleaner way. Just to Compare and understand!
app.post("/signin", signin.signinAuthentication(knex, bcrypt));

app.post("/register", (req, res) => {
  register.handleRegister(req, res, knex, bcrypt);
});

//auth.requireAuth is a middleware authentication, to avoid that anyone without access can access!
// They must have a token to access
app.get("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfile(req, res, knex);
});

app.post("/profile/:id", auth.requireAuth, (req, res) => {
  profile.handleProfileUpdate(req, res, knex);
});

app.put("/image", auth.requireAuth, (req, res) => {
  image.handleImage(req, res, knex);
});

// This is to handle the API
app.post("/imageurl", auth.requireAuth, (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
