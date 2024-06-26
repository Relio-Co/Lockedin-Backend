const express = require('express');
const admin = require('firebase-admin');
require('dotenv').config();

const db = require('./models');
const userRoute = require('./routes/User');
const groupsRoute = require('./routes/Groups');

admin.initializeApp({
  credential: admin.credential.cert(require('./service.json')),
});

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

const validateAndCreateUser = async (req, res) => {
  try {
    const { uid, email, name } = req.user;
    let user = await db.User.findOne({ where: { email } });

    if (!user) {
      user = await db.User.create({ email, username: uid, name });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

app.post('/user/validate-token', authenticateToken, validateAndCreateUser);

app.use('/user', userRoute);
app.use('/groups', authenticateToken, groupsRoute);

db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
