choose th e best and go onconst express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON requests
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SkillSwap Backend API is running!');
});
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});