import fp from 'fastify-plugin'

export default fp(async (fastify) => {
  const consumer = fastify.kafka.consumer('payment-group')

  await consumer.connect()
  await consumer.subscribe({
    topic: 'inventory.reserved',
    fromBeginning: true,
  })

  consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value!.toString())
      console.log(`>>> Proceed payment for`, event)
     
    },
  })

  fastify.addHook('onClose', async () => {
    await consumer.disconnect()
  })
}, {
  dependencies: ['kafka'],
})
