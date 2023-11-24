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
    endpoint: "https://fcm.googleapis.com/fcm/send/dRJcqrv-rmM:APA91bFO_7G73kxzDixQhbgio3An2rbEUQofZbwz27tJM7K1aP3ZxOqV7hnIWc2ftaxScZtzZMVfTnV500FgwySwfIketG7YEn13vzxrrb0WzuhJxBfEVtBLZTAIOuRFA_wez3yxP__Q",
    expirationTime: null,
    keys: {
      p256dh: "BFsyw-JV0iGMLAIglnf5Ja7MH3fJbB_7fTs3jjEk3fZkmaEmrJCGc8uECBKo_fdn5o0lbazZoZtgIWADwmcWtMo",
      auth: "x3wrUNB9O5QuxMTlGGJKfQ"
    }
  }
];

module.exports = { users, subscriptions };
