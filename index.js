import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// ✅ Read firebaseConfig.json manually
const serviceAccount = JSON.parse(
  fs.readFileSync('./firebaseConfig.json', 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// ✅ Firebase Firestore reference
const db = admin.firestore();

// ✅ Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Routes
app.get('/', (req, res) => res.render('index'));

app.get('/quizzes', (req, res) => res.render('quizzes'));

app.get('/quiz', (req, res) => {
  const { topic, level } = req.query;
  if (!topic || !level) return res.status(400).send('Missing topic or level');
  res.render('quiz-template', { topic, level });
});

app.get('/lesson-menu', (req, res) => res.render('index'));

app.get('/lesson/:name', (req, res) => {
  const lessonName = req.params.name;
  const validLessons = ['heart', 'brain', 'skin'];
  if (validLessons.includes(lessonName)) {
    res.render(`lessons/${lessonName}`);
  } else {
    res.status(404).send('Lesson not found');
  }
});

app.get('/register', (req, res) => res.render('register'));

app.post('/register', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) return res.status(400).send('All fields are required');

  try {
    const usersRef = db.collection('users');
    const existing = await usersRef.where('email', '==', email).get();

    if (!existing.empty) return res.status(400).send('Email already registered');

    await usersRef.add({
      email,
      password, // ⚠️ Don't forget to hash in production
      fullName,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error saving to Firestore:', error);
    res.status(500).send('Error registering user');
  }
});

app.get('/login', (req, res) => res.render('login'));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('email', '==', email)
      .where('password', '==', password)
      .get();

    if (snapshot.empty) return res.status(401).send('Invalid credentials');

    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error logging in');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
