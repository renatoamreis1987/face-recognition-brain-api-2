const Clarifai = require("clarifai"); //This is related with the API

//This is related with the IA App, face detection. Is the API key to access
const app = new Clarifai.App({
  apiKey: "41c0cf31de934a3ba8e43e15e766111b"
});

const handleApiCall = (req, res) => {
  app.models
    .predict("e466caa0619f444ab97497640cefc4dc", req.body.input)
    .then(data => {
      console.log(data)
      console.log("Holla", data.outputs[0].data.regions[0].data.concepts[0].name)
      console.log("Hwllllloo", data.outputs[0].data.regions[1].data.concepts[0].name)
      res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))
};

const handleImage = (req, res, knex) => {
  const { id } = req.body;
  knex("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall
};
