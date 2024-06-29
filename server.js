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

app.put('/user/settings', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { username, name, private_account, email_notifications, push_notifications } = req.body;
  let profile_picture = '';

  if (req.files && req.files.profile_picture) {
    const profilePictureFile = req.files.profile_picture;
    const uploadPath = __dirname + '/uploads/' + profilePictureFile.name;
    profile_picture = '/uploads/' + profilePictureFile.name;
    profilePictureFile.mv(uploadPath, function(err) {
      if (err) return res.status(500).send(err);
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const updatedFields = {
      username,
      name,
      private_account,
      email_notifications,
      push_notifications,
    };

    if (profile_picture) {
      updatedFields.profile_picture = profile_picture;
    }

    await pool.query(
      'UPDATE users SET username = $1, name = $2, private_account = $3, email_notifications = $4, push_notifications = $5, profile_picture = $6 WHERE id = $7',
      [username, name, private_account, email_notifications, push_notifications, profile_picture, userId]
    );

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


db.sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
