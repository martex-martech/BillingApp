// import Dashboard from '../Models/dashbord';
// import User from '../Models/User';
// import multer from 'multer';
// import { parse } from 'csv-parse';
// import fs from 'fs';
// import path from 'path';

// export const getDashboardData = async (req: any, res: any) => {
//   try {
//     const latestData = await Dashboard.findOne().sort({ date: -1 });
//     if (!latestData) {
//       return res.status(404).json({ message: 'Dashboard data not found' });
//     }

//     res.json({
//       todaySale: latestData.todaySale,
//       receivable: latestData.receivable,
//       lowStockItems: latestData.lowStockItems
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// };

// export const updateUserDashboardId = async (req: any, res: any) => {
//   try {
//     const { email, dashboardDataId } = req.body;
//     if (!email || !dashboardDataId) {
//       return res.status(400).json({ message: 'Email and dashboardDataId are required' });
//     }

//     const user = await User.findOneAndUpdate(
//       { email: email.toLowerCase() },
//       { dashboardDataId },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'User updated with dashboard data ID', user });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// };

// export const createDashboardData = async (req: any, res: any) => {
//   try {
//     const { todaySale, receivable, lowStockItems, email } = req.body;
//     if (!todaySale || !receivable || !lowStockItems || !email) {
//       return res.status(400).json({ message: 'todaySale, receivable, lowStockItems, and email are required' });
//     }

//     const newDashboardData = new Dashboard({
//       todaySale,
//       receivable,
//       lowStockItems
//     });

//     const savedDashboardData = await newDashboardData.save();

//     const user = await User.findOneAndUpdate(
//       { email: email.toLowerCase() },
//       { dashboardDataId: savedDashboardData._id },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(201).json({ message: 'Dashboard data created and user updated', dashboardData: savedDashboardData, user });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// };

// const upload = multer({ dest: 'uploads/' });

// export const uploadDashboardCSV = [
//   upload.single('file'),
//   async (req: any, res: any) => {
//     if (!req.file) {
//       return res.status(400).json({ message: 'CSV file is required' });
//     }

//     const filePath = path.resolve(req.file.path);
//     const results: any[] = [];
//     const errors: any[] = [];

//     fs.createReadStream(filePath)
//       .pipe(parse({ columns: true, trim: true }))
//       .on('data', async (row) => {
//         try {
//           const { todaySale, receivable, lowStockItems, email } = row;
//           if (!todaySale || !receivable || !lowStockItems || !email) {
//             errors.push({ row, error: 'Missing required fields' });
//             return;
//           }

//           const newDashboardData = new Dashboard({
//             todaySale: Number(todaySale),
//             receivable: Number(receivable),
//             lowStockItems: Number(lowStockItems)
//           });

//           const savedDashboardData = await newDashboardData.save();

//           const user = await User.findOneAndUpdate(
//             { email: email.toLowerCase() },
//             { dashboardDataId: savedDashboardData._id },
//             { new: true }
//           );

//           if (!user) {
//             errors.push({ row, error: 'User not found' });
//             return;
//           }

//           results.push({ row, status: 'success' });
//         } catch (err) {
//           const errorMessage = err instanceof Error ? err.message : String(err);
//           errors.push({ row, error: errorMessage });
//         }
//       })
//       .on('end', () => {
//         fs.unlinkSync(filePath);
//         res.status(200).json({ message: 'CSV processed', results, errors });
//       })
//       .on('error', (err) => {
//         fs.unlinkSync(filePath);
//         res.status(500).json({ message: 'Error processing CSV', error: err.message });
//       });
//   }
// ];
