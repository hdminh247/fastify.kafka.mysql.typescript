import fp from 'fastify-plugin'
import { FastifyRequest } from 'fastify/types/request'
import { FastifyReply } from 'fastify/types/reply'


export default fp(async (fastify) => {
  fastify.register(import('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || "super-scret"
  })

  fastify.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply){
    try{
        await request.jwtVerify()
    }catch{
        reply.code(401).send({error: "Unauthorized"})
    }
  })
})

declare module 'fastify' {
    export interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    }
  }
