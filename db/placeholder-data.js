// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    data: 'USER DATA'
  },
];

const subscriptions = [
  {
    endpoint: "https://fcm.googleapis.com/fcm/send/dH2fr21fwc0:APA91bEDSPvN0KHZN_wva3mYKWX_7p-38u_Htg7L6yYEf4VQIRh629laWhkpCSQzw52HL7tXUb1jsrrmud_xr0QYOZChHQdavFxKwTZhkUcHBP7sDANCuCi458ATnFdhNMbkYCpJpVj-",
    expirationTime: null,
    keys: {
      p256dh: "BMg5VRdUc2rLOI2ep_Oy9nYDgcj3aL4o4a-GKYPUCu7XPlSe1lCXqZX5d-joj4OfWe8VMA-27_UnydcRxGDW-FQ",
      auth: "yQEhTdes4Z4t_Fr2hrUe-w"
    }
  }
];

module.exports = { users, subscriptions };
