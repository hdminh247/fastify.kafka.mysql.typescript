import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core'

export const orders = mysqlTable('orders', {
  id: int('id').primaryKey().autoincrement(),
  userId: varchar('userId', { length: 255 }).notNull(),
  orderId: varchar('orderId', { length: 255 }).notNull(),
  productId: int('productId').default(0),
  quantity: int('quantity').default(1),
  status: varchar('status', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
})