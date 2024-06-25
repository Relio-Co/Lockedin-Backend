const express = require('express');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

const userRoute = require("./routes/User")
app.use("/user", userRoute)

db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });