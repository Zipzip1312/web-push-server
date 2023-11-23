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
    endpoint: "https://fcm.googleapis.com/fcm/send/fGjqNe7BFH0:APA91bEGhBwH7Mw70u5AaO5Qe0gP5cRXsVVKLX2tT52rt61lpiBRyanNhFSWb-g89MFEGadHoyGjJwoNCh4ume6HMNiaBA0q4g3xf2fyCt1Enc0G-_-t7ofRvot9iqFNPc53UMrA5X3G",
    expirationTime: null,
    keys: {
      p256dh: "BJ2wYMC7SA7W7XyhOymzrrT3L413grZfo6ihEfdA0w9xXp1Z1Qa-GspB1--HaUCZsEG4tbRNO8ep9gtYw6X-tZM",
      auth: "DV5Ev8ctw2xbVjNu8CS7bw"
    }
  }
];

module.exports = { users, subscriptions };
