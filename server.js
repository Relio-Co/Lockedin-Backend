const express = require('express');
const admin = require('firebase-admin');
require('dotenv').config();

const db = require('./models');
const userRoute = require('./routes/User');
const groupsRoute = require('./routes/Groups');
const friendsRoute = require('./routes/Friends');
const { validateAndCreateUser } = require('./controllers/userController'); // Ensure this import is correct

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
    console.error('Error verifying token:', error);
    return res.sendStatus(403);
  }
};

app.post('/user/validate-token', authenticateToken, validateAndCreateUser);

app.use('/user', authenticateToken, userRoute);
app.use('/groups', authenticateToken, groupsRoute);
app.use('/friends', authenticateToken, friendsRoute);

db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
