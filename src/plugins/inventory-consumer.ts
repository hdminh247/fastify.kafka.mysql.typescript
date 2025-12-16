import fp from 'fastify-plugin'
import { products } from '../models/product'
import { orders } from '../models/order'
import { eq, sql } from 'drizzle-orm'

export default fp(async (fastify) => {
  const consumer = fastify.kafka.consumer('inventory-group')

  await consumer.connect()
  await consumer.subscribe({
    topic: 'order.created',
    fromBeginning: true,
  })

  consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value!.toString())

      // Get product
      const product = await fastify.db.select().from(products).where(eq(products.id, event.productId))
      if(product.length > 0){
        // Do update
      const [result] = await fastify.db.update(products).set({stock: sql`${products.stock} - ${event.quantity}`})
      .where(sql`${products.id} = ${event.productId} AND ${products.stock} >= ${event.quantity} AND ${products.stock} > 0`)


      // Sold out
      if(result.affectedRows === 0){
        await fastify.db.update(orders).set({status: 'REJECTED'}).where(eq(orders.orderId, event.orderId))

        await fastify.kafka.producer.send({
          topic: 'inventory.sold_out',
          messages: [
            {
              key: String(event.orderId),
              value: JSON.stringify(event)
            }
          ]
        })

        return;
      }

      await fastify.db.update(orders).set({status: 'RESERVED'}).where(eq(orders.orderId, event.orderId))

      await fastify.kafka.producer.send({
        topic: 'inventory.reserved',
        messages: [
          {
            key: String(event.orderId),
              value: JSON.stringify(event)
          }
        ]
      })


      }

     
    },
  })

  fastify.addHook('onClose', async () => {
    await consumer.disconnect()
  })
}, {
  dependencies: ['kafka'],
})
