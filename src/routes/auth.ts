import * as brypt from 'bcrypt'
import { FastifyPluginAsync } from 'fastify'
import { eq } from 'drizzle-orm'
import { signupSchema, signinSchema } from '../schemas/auth';

import { users } from '../models/user';

type AuthBody = {
  username: string
  password: string
}

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.post<{ Body: AuthBody }>('/login', {schema: signinSchema}, async function (request, reply) {
      const { username, password } = request.body;

      // Call db to check if user exist
      const userData: any[] = await fastify.db.select().from(users).where(eq(users.username, username))
      console.log(`Data`, userData)

      if(userData.length === 0){
        throw new Error("Unthorized")
      }

      // Compare password
      if(!await brypt.compare(password, userData[0].password)){
        throw Error("Unthorizied")
      }

      const token = await fastify.jwt.sign({
        id: userData[0].id,
        username
      })

      return {user: userData, token};
    })
    fastify.post<{ Body: AuthBody }>('/sign-up', { schema: signupSchema }, async function (request, reply) {
        const { username, password } = request.body;

        // Call db to check if user exist

        // Check if user existed
        const existingUsers = await fastify.db.select().from(users).where(eq(users.username, username))

        if(existingUsers.length > 0){
            throw new Error("User existed")
        }

        const user = {
            username, 
            password: await brypt.hash(password, 10)
        }

        // Insert to db
        const createdUser = await fastify.db.insert(users).values(user)


        const token = fastify.jwt.sign({
            id: "",
            username
        })

        return {user: createdUser, token}
      })
}

export default auth