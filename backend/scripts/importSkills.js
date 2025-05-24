const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import Skill model
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
    // Read skills data from JSON file
    const skillsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/additionalSkills.json'), 'utf-8')
    );

    console.log(`Found ${skillsData.length} skills to import`);

    // Check if skills already exist to avoid duplicates
    const existingSkills = await Skill.find({ title: { $in: skillsData.map(skill => skill.title) } });
    const existingTitles = existingSkills.map(skill => skill.title);

    // Filter out skills that already exist
    const newSkills = skillsData.filter(skill => !existingTitles.includes(skill.title));

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

    process.exit(0);
  } catch (error) {
    console.error('Error importing skills:', error);
    process.exit(1);
  }
});

