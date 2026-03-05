// Quick script to verify all guides in the database
// Run with: node verifyAllGuides.js

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.DATABASE_CONNECTION_URI || 'mongodb://localhost:27017/devTinder')
  .then(() => {
    console.log('✅ Connected to database');
    return verifyAllGuides();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });

async function verifyAllGuides() {
  try {
    // Get TouristGuideProfile model
    const TouristGuideProfile = require('./src/models/touristGuideProfile');
    
    // Find all unverified guides
    const unverifiedGuides = await TouristGuideProfile.find({ isVerified: false });
    
    if (unverifiedGuides.length === 0) {
      console.log('✅ All guides are already verified!');
      process.exit(0);
      return;
    }
    
    console.log(`\n📋 Found ${unverifiedGuides.length} unverified guide(s):\n`);
    
    // Verify all guides
    for (const guide of unverifiedGuides) {
      console.log(`- ${guide.guideName} (${guide._id})`);
      guide.isVerified = true;
      guide.verifiedAt = new Date();
      await guide.save();
    }
    
    console.log(`\n✅ Successfully verified ${unverifiedGuides.length} guide(s)!\n`);
    
    // Show all guides with their status
    const allGuides = await TouristGuideProfile.find();
    
    console.log('📊 All Guides Status:\n');
    for (const guide of allGuides) {
      console.log(`\n👤 ${guide.guideName}`);
      console.log(`   ID: ${guide._id}`);
      console.log(`   Verified: ${guide.isVerified ? '✅ Yes' : '❌ No'}`);
      console.log(`   Subscription: ${guide.subscriptionStatus}`);
      console.log(`   Monasteries: ${guide.selectedMonasteries.length}`);
      guide.selectedMonasteries.forEach(m => {
        console.log(`      - ${m.monasteryName}`);
      });
    }
    
    console.log('\n✅ Done!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}
