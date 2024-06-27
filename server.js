const express = require('express');
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const db = require('./models');
const userRoute = require('./routes/User');
const groupsRoute = require('./routes/Groups');
const friendsRoute = require('./routes/Friends');
const postsRoute = require('./routes/Posts');
const { validateAndCreateUser } = require('./controllers/userController');

admin.initializeApp({
  credential: admin.credential.cert(require('./service.json')),
});

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the original file extension
  }
});

const upload = multer({ storage: storage });

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

app.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/user', authenticateToken, userRoute);
app.use('/groups', authenticateToken, groupsRoute);
app.use('/friends', authenticateToken, friendsRoute);
app.use('/posts', authenticateToken, postsRoute);

db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
