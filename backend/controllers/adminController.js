const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new user (admin functionality)
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all users with filtering and sorting
const getUsers = async (req, res) => {
  try {
    const { 
      search,
      name, 
      email, 
      address, 
      role, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    } else {
      if (name) query.name = { $regex: name, $options: 'i' };
      if (email) query.email = { $regex: email, $options: 'i' };
      if (address) query.address = { $regex: address, $options: 'i' };
    }

    if (role) query.role = role;

    // Sorting
    const sort = {};
    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const validSortOrders = ['asc', 'desc'];
    
    let sortField = 'name';
    let sortDirection = 1;

    if (validSortFields.includes(sortBy)) {
      sortField = sortBy === 'created_at' ? 'createdAt' : sortBy;
    }
    
    if (validSortOrders.includes(sortOrder.toLowerCase())) {
      sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    }
    
    sort[sortField] = sortDirection;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limitNum);

    // Format users for response
    const formattedUsers = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      address: u.address,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt
    }));

    res.json({
      users: formattedUsers,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalUsers,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user details
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If user is a store owner, get their store details
    let storeDetails = null;
    if (user.role === 'store_owner') {
      const store = await Store.findOne({ owner: user._id });
      if (store) {
        storeDetails = {
          name: store.name,
          email: store.email,
          address: store.address,
          averageRating: store.averageRating,
          totalRatings: store.totalRatings
        };
      }
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        store: storeDetails,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user details (admin functionality)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role, password } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (role) user.role = role;
    
    // Update password if provided
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email is already in use' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user (admin functionality)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Also delete associated store if user is store owner
    if (user.role === 'store_owner') {
      await Store.deleteOne({ owner: id });
    }
    
    // Also delete associated ratings
    await Rating.deleteMany({ user: id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new store
const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Check if store with email already exists
    const existingStore = await Store.findOne({ email });

    if (existingStore) {
      return res.status(400).json({ error: 'Store with this email already exists' });
    }

    // Verify owner if provided
    let owner = null;
    if (ownerId) {
      owner = await User.findOne({ _id: ownerId, role: 'store_owner' });
      if (!owner) {
        return res.status(400).json({ error: 'Invalid store owner ID' });
      }
    }

    const store = await Store.create({
      name,
      email,
      address,
      owner: owner ? owner._id : null
    });

    res.status(201).json({
      message: 'Store created successfully',
      store: {
        id: store._id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.owner,
        averageRating: 0,
        totalRatings: 0,
        createdAt: store.createdAt,
        updatedAt: store.updatedAt
      }
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all stores (admin view)
const getStores = async (req, res) => {
  try {
    const { 
      search,
      name, 
      address, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    } else {
      if (name) query.name = { $regex: name, $options: 'i' };
      if (address) query.address = { $regex: address, $options: 'i' };
    }

    // Sorting
    const sort = {};
    const validSortFields = ['name', 'address', 'averageRating', 'totalRatings'];
    const validSortOrders = ['asc', 'desc'];
    
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

    const stores = await Store.find(query)
      .populate('owner', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const totalStores = await Store.countDocuments(query);
    const totalPages = Math.ceil(totalStores / limitNum);

    const formattedStores = stores.map(store => ({
      id: store._id,
      name: store.name,
      email: store.email,
      address: store.address,
      ownerName: store.owner ? store.owner.name : 'N/A',
      ownerEmail: store.owner ? store.owner.email : 'N/A',
      averageRating: store.averageRating,
      totalRatings: store.totalRatings,
      createdAt: store.createdAt,
      updatedAt: store.updatedAt
    }));

    res.json({
      stores: formattedStores,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalStores,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get admin stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createStore,
  getStores
};
