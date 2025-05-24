const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables from the backend .env file
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/userModel');
const Skill = require('../models/skillModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Create a dummy user if it doesn't exist
    const dummyUser = {
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
      role: 'both' // Can be 'learner', 'teacher', or 'both'
    };

    // Check if user already exists
    let user = await User.findOne({ email: dummyUser.email });
    
    if (!user) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dummyUser.password, salt);
      
      // Create new user
      user = await User.create({
        ...dummyUser,
        password: hashedPassword
      });
      
      console.log(`Created dummy user: ${user.name} (${user.email})`);
    } else {
      console.log(`Using existing user: ${user.name} (${user.email})`);
    }

    // Read skills data from JSON file
    const skillsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/dummySkills.json'), 'utf-8')
    );

    console.log(`Found ${skillsData.length} skills to import`);

    // Update owner field with the actual user ID
    const skillsWithOwner = skillsData.map(skill => ({
      ...skill,
      owner: user._id
    }));

    // Check if skills already exist to avoid duplicates
    const existingSkills = await Skill.find({ title: { $in: skillsWithOwner.map(skill => skill.title) } });
    const existingTitles = existingSkills.map(skill => skill.title);

    // Filter out skills that already exist
    const newSkills = skillsWithOwner.filter(skill => !existingTitles.includes(skill.title));

    if (newSkills.length === 0) {
      console.log('All skills already exist in the database. No new skills to import.');
      process.exit(0);
    }

    console.log(`Importing ${newSkills.length} new skills...`);

    // Insert new skills
    const result = await Skill.insertMany(newSkills);

    console.log(`Successfully imported ${result.length} skills!`);
    console.log('Skills imported:');
    result.forEach(skill => console.log(` - ${skill.title}`));

    // Print database credentials for the user
    console.log('\nDatabase Credentials:');
    console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
    console.log(`Demo User Email: ${dummyUser.email}`);
    console.log(`Demo User Password: ${dummyUser.password}`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
});