// Check guide profiles and their status
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_CONNECTION_URI || 'mongodb://localhost:27017/devTinder')
  .then(() => {
    console.log('✅ Connected to database\n');
    return checkGuides();
  })
  .catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1);
  });

async function checkGuides() {
  try {
    const TouristGuideProfile = require('./src/models/touristGuideProfile');
    const GuideSubscription = require('./src/models/guideSubscription');
    
    // Find ALL guides
    const allGuides = await TouristGuideProfile.find();
    
    console.log(`📊 Total guides in database: ${allGuides.length}\n`);
    
    if (allGuides.length === 0) {
      console.log('❌ No guides found in database!');
      console.log('Please create a guide profile through the website first.\n');
      process.exit(0);
    }
    
    for (const guide of allGuides) {
      console.log('═══════════════════════════════════════');
      console.log(`👤 Guide: ${guide.guideName}`);
      console.log(`   ID: ${guide._id}`);
      console.log(`   User ID: ${guide.userId}`);
      console.log(`   Verified: ${guide.isVerified ? '✅ YES' : '❌ NO (needs verification!)'}`);
      console.log(`   Subscription Status: ${guide.subscriptionStatus === 'active' ? '✅ ACTIVE' : '❌ ' + guide.subscriptionStatus.toUpperCase()}`);
      console.log(`   Subscription ID: ${guide.subscriptionId || 'None'}`);
      
      if (guide.selectedMonasteries && guide.selectedMonasteries.length > 0) {
        console.log(`   Selected Monasteries (${guide.selectedMonasteries.length}):`);
        guide.selectedMonasteries.forEach(m => {
          console.log(`      - ${m.monasteryName}`);
          console.log(`        ID: ${m.monasteryId}`);
        });
      } else {
        console.log('   ❌ No monasteries selected!');
      }
      
      // Check subscription details
      if (guide.subscriptionId) {
        const sub = await GuideSubscription.findById(guide.subscriptionId);
        if (sub) {
          console.log(`   Subscription Details:`);
          console.log(`      Active: ${sub.isActive ? '✅ YES' : '❌ NO'}`);
          console.log(`      Plan: ${sub.planType}`);
          console.log(`      Next Renewal: ${sub.nextRenewalDate}`);
        }
      }
      
      console.log('\n   Display Status:');
      const canDisplay = guide.isVerified && guide.subscriptionStatus === 'active';
      console.log(`      ${canDisplay ? '✅ WILL BE VISIBLE' : '❌ WILL NOT BE VISIBLE'}`);
      
      if (!canDisplay) {
        console.log('\n   ⚠️  Issues:');
        if (!guide.isVerified) console.log('      - Guide needs verification (isVerified: false)');
        if (guide.subscriptionStatus !== 'active') console.log(`      - Subscription not active (status: ${guide.subscriptionStatus})`);
      }
      console.log('');
    }
    
    console.log('═══════════════════════════════════════\n');
    
    // Check specific monastery
    const targetMonastery = '69a3cea9e9b0d19db3da37a5';
    const guidesForMonastery = await TouristGuideProfile.find({
      'selectedMonasteries.monasteryId': targetMonastery,
      subscriptionStatus: 'active',
      isVerified: true
    });
    
    console.log(`🔍 Guides for monastery ${targetMonastery}:`);
    console.log(`   Found: ${guidesForMonastery.length}\n`);
    
    if (guidesForMonastery.length === 0) {
      console.log('💡 To make guides visible:');
      console.log('   1. Verify guides: node verifyAllGuides.js');
      console.log('   2. Make sure subscription is active');
      console.log('   3. Ensure correct monastery is selected\n');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}
