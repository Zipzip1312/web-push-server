export interface ISubscriptionKey {
  p256dh: string
  auth: string
}

export interface ISubscriptionsTable {
  endpoint: string
  expirationTime: string
  keys: ISubscriptionKey
}

export interface IUsersTable {
  name: string
  data: string
}

export interface Database {
  subscriptions: ISubscriptionsTable;
  users: IUsersTable;
}
