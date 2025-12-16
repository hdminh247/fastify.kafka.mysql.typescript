import fp from 'fastify-plugin'
import mysql from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'


export default fp(async (fastify) => {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL
  })

  const db = drizzle(pool)

  fastify.decorate('db', db)
})

declare module 'fastify' {
  export interface FastifyInstance {
    db: any;
  }
}
