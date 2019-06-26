const handleSignin = (knex, bcrypt) => (req, res) => {
    const { email, password } = req.body
    //Bellow the if statement is validation on server side
    if (!email || !password) {
        return res.status(400).json('Incorrect form submission')
    }
    knex.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash)
        if (isValid) {
          return knex.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('Wrong Credentials')
        }
      })
      .catch(err => res.status(400).json('Wrong Credentials'))
}

module.exports = {
    handleSignin
}