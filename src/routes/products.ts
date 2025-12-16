import { FastifyPluginAsync } from 'fastify'
import { v4 as uuidv4 } from 'uuid';

import { products } from '../models/product';
import { orders} from '../models/order'

type Order = {
    productId: number;
    quantity: number;
}


const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/products', {preHandler: fastify.authenticate}, async function (request, reply) {
        const productData = await fastify.db.select().from(products)
        return productData
    })

    fastify.post<{Body: Order}>('/product/order', {preHandler: fastify.authenticate}, async function (request, reply) {
       const { productId, quantity} = request.body
       const userId = Number((request.user as any).id)

       const orderId = uuidv4();
       const order = await fastify.db.insert(orders).values({
        orderId,
        userId,
        productId,
        quantity,
        status: 'PENDING'
       })
       
       await fastify.kafka.producer.send({
        topic: 'order.created',
        messages: [
            {
                key: String(orderId),
                value: JSON.stringify({
                    orderId,
                    productId,
                    quantity
                })
            }
        ]
       })
       return {success: true}
    })
}

export default auth