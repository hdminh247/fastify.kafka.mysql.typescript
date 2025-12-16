import { FastifyPluginAsync } from 'fastify'
import { eq } from 'drizzle-orm'

import { users } from '../models/user';
import { userSchema } from '../schemas/profile';


const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/profile', {preHandler: fastify.authenticate, schema: userSchema}, async function (request, reply) {
        const userId = Number((request.user as any).id)
        const userData = await fastify.db.select().from(users).where(eq(users.id, userId))

        return userData[0]
    })
}

export default auth