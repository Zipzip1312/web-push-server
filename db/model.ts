export interface ISubscriptionKey {
  p256dh: string
  auth: string
}

export interface ISubscriptionsTable {
  endpoint: string
  expirationTime: string
  keys: ISubscriptionKey
  userId: number
  userName: string
}

export interface Database {
  subscriptions: ISubscriptionsTable;
}
