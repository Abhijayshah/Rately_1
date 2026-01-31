const Store = require('../models/Store');
const Rating = require('../models/Rating');
const User = require('../models/User');

// Get all stores for normal users
const getStores = async (req, res) => {
  try {
    const { 
      name, 
      address, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    const userId = req.user.userId;

    // Build query
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (address) {
      query.address = { $regex: address, $options: 'i' };
    }

    // Sorting
    const sort = {};
    const validSortFields = ['name', 'address', 'averageRating'];
    const validSortOrders = ['asc', 'desc'];
    
    // Default sort
    let sortField = 'name';
    let sortDirection = 1;

    if (validSortFields.includes(sortBy)) {
      sortField = sortBy;
    }
    
    if (validSortOrders.includes(sortOrder.toLowerCase())) {
      sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    }
    
    sort[sortField] = sortDirection;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const stores = await Store.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(); // Use lean for performance since we'll modify the result

    // Get total count
    const totalStores = await Store.countDocuments(query);
    const totalPages = Math.ceil(totalStores / limitNum);

    // Check for user ratings for each store
    const storeIds = stores.map(store => store._id);
    const userRatings = await Rating.find({
      user: userId,
      store: { $in: storeIds }
    });

    // Create a map of storeId -> rating
    const userRatingMap = {};
    userRatings.forEach(r => {
      userRatingMap[r.store.toString()] = r.rating;
    });

    // Add user_rating to store objects
    const storesWithRating = stores.map(store => ({
      id: store._id,
      name: store.name,
      address: store.address,
      average_rating: store.averageRating, // Mapping back to snake_case for frontend compatibility if needed, or stick to camelCase
      total_ratings: store.totalRatings,
      user_rating: userRatingMap[store._id.toString()] || null
    }));

    res.json({
      stores: storesWithRating,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalStores,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get store details
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const store = await Store.findById(id).lean();

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Get user's rating for this store
    const userRating = await Rating.findOne({
      user: userId,
      store: id
    });

    res.json({
      store: {
        id: store._id,
        name: store.name,
        address: store.address,
        average_rating: store.averageRating,
        total_ratings: store.totalRatings,
        user_rating: userRating ? userRating.rating : null
      }
    });
  } catch (error) {
    console.error('Get store details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Submit or update rating
const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.userId;

    if (!storeId || !rating) {
      return res.status(400).json({ error: 'Store ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if store exists
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if user has already rated this store
    let existingRating = await Rating.findOne({
      user: userId,
      store: storeId
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      // Create new rating
      await Rating.create({
        user: userId,
        store: storeId,
        rating
      });
    }

    // The average rating calculation is handled by the post-save hook in Rating model

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's ratings
const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const ratings = await Rating.find({ user: userId })
      .populate('store', 'name address')
      .sort({ updatedAt: -1 });

    const formattedRatings = ratings.map(r => ({
      id: r._id,
      rating: r.rating,
      storeId: r.store._id,
      storeName: r.store.name,
      storeAddress: r.store.address,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));

    res.json({ ratings: formattedRatings });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Store Owner Dashboard
const getStoreRatings = async (req, res) => {
  try {
    const { 
      search,
      page = 1,
      limit = 10
    } = req.query;
    const userId = req.user.userId;

    // Find store owned by this user
    // Note: Assuming one store per owner for now as per Schema (owner field in Store)
    const store = await Store.findOne({ owner: userId });

    if (!store) {
      // It's possible the user is a store owner but hasn't been assigned a store yet,
      // or the store creation logic didn't link them.
      // For now return empty or specific message
      return res.json({ 
        store: null,
        ratings: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalRatings: 0,
          limit: 10
        }
      });
    }

    const query = { store: store._id };

    // Handle search on user fields
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      const userIds = users.map(u => u._id);
      query.user = { $in: userIds };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const ratings = await Rating.find(query)
      .populate('user', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalRatings = await Rating.countDocuments(query);
    const totalPages = Math.ceil(totalRatings / limitNum);

    const formattedRatings = ratings.map(r => ({
      id: r._id,
      rating: r.rating,
      userName: r.user ? r.user.name : 'Unknown',
      userEmail: r.user ? r.user.email : 'Unknown',
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));

    // Calculate store rank
    const higherRatedStores = await Store.countDocuments({ 
      averageRating: { $gt: store.averageRating } 
    });
    const rank = higherRatedStores + 1;

    // Calculate rating distribution
    const distributionData = await Rating.aggregate([
      { $match: { store: store._id } },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    distributionData.forEach(item => {
      distribution[item._id] = item.count;
    });

    res.json({ 
      store: {
        id: store._id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: store.averageRating,
        totalRatings: store.totalRatings,
        rank,
        distribution
      },
      ratings: formattedRatings,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalRatings,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStores,
  getStoreById,
  submitRating,
  getUserRatings,
  getStoreRatings
};
