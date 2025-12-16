import { mysqlTable, int, varchar, timestamp } from 'drizzle-orm/mysql-core'

export const products = mysqlTable('products', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  stock: int('stock').default(0),
  createdAt: timestamp('created_at').defaultNow()
})