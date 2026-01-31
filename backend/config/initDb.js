const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

async function initializeDatabase() {
  try {
    console.log('Checking database initialization...');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@rately.com' });
    
    if (!adminExists) {
      console.log('Creating default admin account...');
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('Admin@123', saltRounds);
      
      await User.create({
        name: 'System Administrator Account',
        email: 'admin@rately.com',
        password: hashedPassword,
        address: '123 Admin Street, Admin City, Admin State 12345',
        role: 'system_admin'
      });
      
      console.log('Default admin created successfully!');
    } else {
      console.log('Default admin already exists.');
    }

    // Check if normal user exists
    const userExists = await User.findOne({ email: 'user@rately.com' });
    
    if (!userExists) {
      console.log('Creating default normal user account...');
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('User@123', saltRounds);
      
      await User.create({
        name: 'Normal User Account for Testing',
        email: 'user@rately.com',
        password: hashedPassword,
        address: '456 User Avenue, User City, User State 67890',
        role: 'normal_user'
      });
      
      console.log('Default normal user created successfully!');
    } else {
      console.log('Default normal user already exists.');
    }

    // Check if store owner exists
    let storeOwner = await User.findOne({ email: 'store@rately.com' });
    
    if (!storeOwner) {
      console.log('Creating default store owner account...');
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('Store@123', saltRounds);
      
      storeOwner = await User.create({
        name: 'Store Owner Account for Testing',
        email: 'store@rately.com',
        password: hashedPassword,
        address: '789 Store Blvd, Store City, Store State 13579',
        role: 'store_owner'
      });
      
      console.log('Default store owner created successfully!');
    } else {
      console.log('Default store owner already exists.');
    }

    // Check if store exists for the owner
    let storeExists = await Store.findOne({ owner: storeOwner._id });
    
    // If not found by owner, check by email (to handle DB state from previous deployments)
    if (!storeExists) {
      const storeByEmail = await Store.findOne({ email: 'info@techgadgets.com' });
      if (storeByEmail) {
        console.log('Found store by email. Updating owner...');
        storeByEmail.owner = storeOwner._id;
        await storeByEmail.save();
        storeExists = storeByEmail;
      }
    }
    
    if (!storeExists) {
      console.log('Creating default store for store owner...');
      
      const newStore = await Store.create({
        name: 'Tech Gadgets and Electronics Superstore',
        email: 'info@techgadgets.com',
        address: '789 Store Blvd, Store City, Store State 13579',
        owner: storeOwner._id,
        averageRating: 4.5,
        totalRatings: 12
      });
      
      console.log('Default store created successfully!');

      // Create dummy ratings for the store
      console.log('Creating default ratings...');
      const normalUser = await User.findOne({ email: 'user@rately.com' });
      
      // Create additional dummy users for ratings
      const dummyUsers = [];
      for (let i = 1; i <= 4; i++) {
        let user = await User.findOne({ email: `user${i}@rately.com` });
        
        if (!user) {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash('User@123', saltRounds);
          
          user = await User.create({
            name: `Test User ${i}`,
            email: `user${i}@rately.com`,
            password: hashedPassword,
            address: `Test Address ${i}`,
            role: 'normal_user'
          });
        }
        dummyUsers.push(user);
      }

      if (normalUser) {
        const ratings = [
          { rating: 5, user: normalUser._id, store: newStore._id, comment: 'Excellent service!' },
          { rating: 4, user: dummyUsers[0]._id, store: newStore._id, comment: 'Good products.' },
          { rating: 5, user: dummyUsers[1]._id, store: newStore._id, comment: 'Will buy again.' },
          { rating: 5, user: dummyUsers[2]._id, store: newStore._id, comment: 'Amazing!' },
          { rating: 4, user: dummyUsers[3]._id, store: newStore._id, comment: 'Nice.' }
        ];

        for (const r of ratings) {
          await Rating.create(r);
        }
        console.log('Default ratings created successfully!');
      }

    } else {
      console.log('Default store already exists.');
      
      // Check if ratings exist, if not create them
      const ratingsCount = await Rating.countDocuments({ store: storeExists._id });
      if (ratingsCount < 5) {
        console.log('Ensuring default ratings for existing store...');
        const normalUser = await User.findOne({ email: 'user@rately.com' });
        
        // Create additional dummy users for ratings
        const dummyUsers = [];
        for (let i = 1; i <= 4; i++) {
          let user = await User.findOne({ email: `user${i}@rately.com` });
          if (!user) {
            const hashedPassword = await bcrypt.hash('User@123', 10);
            user = await User.create({
              name: `Test User ${i} - Verified Account`,
              email: `user${i}@rately.com`,
              password: hashedPassword,
              role: 'normal_user',
              address: `Test Address ${i} - Detailed Location Info`
            });
          }
          dummyUsers.push(user);
        }

        if (normalUser) {
          const ratings = [
            { rating: 5, user: normalUser._id, store: storeExists._id, comment: 'Excellent service!' },
            { rating: 4, user: dummyUsers[0]._id, store: storeExists._id, comment: 'Good products.' },
            { rating: 5, user: dummyUsers[1]._id, store: storeExists._id, comment: 'Will buy again.' },
            { rating: 5, user: dummyUsers[2]._id, store: storeExists._id, comment: 'Amazing!' },
            { rating: 4, user: dummyUsers[3]._id, store: storeExists._id, comment: 'Nice.' }
          ];

          for (const r of ratings) {
             // Check if rating already exists to avoid duplicates
             const exists = await Rating.findOne({ user: r.user, store: r.store });
             if (!exists) {
               await Rating.create(r);
             }
          }
          console.log('Default ratings ensured successfully!');
          
          // Update store stats to match ratings
          const newTotalRatings = await Rating.countDocuments({ store: storeExists._id });
          // Calculate new average
          const allRatings = await Rating.find({ store: storeExists._id });
          const sumRatings = allRatings.reduce((acc, curr) => acc + curr.rating, 0);
          const newAvg = newTotalRatings > 0 ? (sumRatings / newTotalRatings).toFixed(1) : 0;

          storeExists.averageRating = newAvg;
          storeExists.totalRatings = newTotalRatings;
          await storeExists.save();
        }
      } else {
        // Force update stats even if we didn't add new ratings, to ensure consistency
        console.log('Syncing store stats with ratings...');
        const newTotalRatings = await Rating.countDocuments({ store: storeExists._id });
        const allRatings = await Rating.find({ store: storeExists._id });
        const sumRatings = allRatings.reduce((acc, curr) => acc + curr.rating, 0);
        const newAvg = newTotalRatings > 0 ? (sumRatings / newTotalRatings).toFixed(1) : 0;

        storeExists.averageRating = newAvg;
        storeExists.totalRatings = newTotalRatings;
        await storeExists.save();
        console.log(`Store stats synced: ${newTotalRatings} ratings, ${newAvg} avg.`);
      }
    }
    
    console.log('Database initialization complete!');
    console.log('Default credentials:');
    console.log('-------------------------');
    console.log('Admin:');
    console.log('  Email: admin@rately.com');
    console.log('  Password: Admin@123');
    console.log('User:');
    console.log('  Email: user@rately.com');
    console.log('  Password: User@123');
    console.log('Store Owner:');
    console.log('  Email: store@rately.com');
    console.log('  Password: Store@123');
    console.log('-------------------------');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = initializeDatabase;
