// Check user locations (hotels) and their visibility
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_CONNECTION_URI || 'mongodb://localhost:27017/devTinder')
  .then(() => {
    console.log('✅ Connected to database\n');
    return checkLocations();
  })
  .catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1);
  });

async function checkLocations() {
  try {
    const UserLocation = require('./src/models/userLocation');
    const LocationSubscription = require('./src/models/locationSubscription');
    
    // Find ALL locations
    const allLocations = await UserLocation.find();
    
    console.log(`📊 Total locations in database: ${allLocations.length}\n`);
    
    if (allLocations.length === 0) {
      console.log('❌ No locations found in database!');
      console.log('Please add a location through the website first.\n');
      process.exit(0);
    }
    
    for (const location of allLocations) {
      console.log('═══════════════════════════════════════');
      console.log(`🏨 Location: ${location.name}`);
      console.log(`   ID: ${location._id}`);
      console.log(`   Type: ${location.type}`);
      console.log(`   User ID: ${location.userId}`);
      
      // Check coordinates
      if (location.location && location.location.coordinates) {
        console.log(`   ✅ Coordinates: [${location.location.coordinates.join(', ')}]`);
      } else {
        console.log(`   ❌ NO COORDINATES (won't show on map!)`);
      }
      
      // Check address
      if (location.location && location.location.address) {
        console.log(`   Address: ${location.location.address}`);
      }
      
      console.log(`   Subscription Status: ${location.subscriptionStatus === 'active' ? '✅ ACTIVE' : '❌ ' + location.subscriptionStatus.toUpperCase()}`);
      console.log(`   Subscription ID: ${location.subscriptionId || 'None'}`);
      
      // Check subscription details
      if (location.subscriptionId) {
        const sub = await LocationSubscription.findById(location.subscriptionId);
        if (sub) {
          console.log(`   Subscription Details:`);
          console.log(`      Active: ${sub.isActive ? '✅ YES' : '❌ NO'}`);
          console.log(`      Plan: ${sub.planType}`);
          console.log(`      Amount: ₹${sub.monthlyAmount}`);
          console.log(`      Next Renewal: ${new Date(sub.nextRenewalDate).toLocaleDateString()}`);
        }
      }
      
      console.log('\n   Map Display Status:');
      const canDisplay = location.location?.coordinates && location.subscriptionStatus === 'active';
      console.log(`      ${canDisplay ? '✅ WILL BE VISIBLE ON MAP' : '❌ WILL NOT BE VISIBLE'}`);
      
      if (!canDisplay) {
        console.log('\n   ⚠️  Issues:');
        if (!location.location?.coordinates) console.log('      - Missing coordinates (add location with proper GPS)');
        if (location.subscriptionStatus !== 'active') console.log(`      - Subscription not active (status: ${location.subscriptionStatus})`);
      }
      console.log('');
    }
    
    console.log('═══════════════════════════════════════\n');
    
    // Count active locations with coordinates
    const visibleLocations = allLocations.filter(loc => 
      loc.location?.coordinates && loc.subscriptionStatus === 'active'
    );
    
    console.log(`🗺️  Visible locations on map: ${visibleLocations.length}/${allLocations.length}\n`);
    
    if (visibleLocations.length === 0) {
      console.log('💡 To show locations on map:');
      console.log('   1. Add location with valid coordinates (GPS location)');
      console.log('   2. Ensure subscription is ACTIVE');
      console.log('   3. If subscription shows as inactive, renew it through the website\n');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}
