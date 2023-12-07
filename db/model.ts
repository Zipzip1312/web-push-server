export interface ISubscriptionKey {
  p256dh: string
  auth: string
}

export interface ISubscriptionsTable {
  endpoint: string
  expirationTime: string
  keys: ISubscriptionKey
  userid: number
  username: string
}

export interface Database {
  subscriptions: ISubscriptionsTable;
}
