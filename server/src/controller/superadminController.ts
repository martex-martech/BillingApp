import { RequestHandler } from 'express';
import User from '../Models/User';

export const createAdminUser: RequestHandler = async (req: any, res: any) => {
  try {
    const { email, role, plan, expiry } = req.body;

    if (!email || !role || !plan || !expiry) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const newUser = new User({
      email,
      role,
      plan,
      expiry: new Date(expiry),
      status: 'active',
    });

    await newUser.save();

    return res.status(201).json({ message: 'Admin created', user: newUser });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAdminUsers = async (req: any, res: any): Promise<void> => {
  try {
    const { filter = 'all' } = req.query;

    let query: any = { role: { $ne: 'superadmin' } };

    if (filter !== 'all') {
      query.status = filter;
    }

    const users = await User.find(query).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const updateUserStatus = async (req: any, res: any): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('❌ Error updating status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserRole = async (req: any, res: any): Promise<void> => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('❌ Error updating role:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAdmin: RequestHandler = async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};