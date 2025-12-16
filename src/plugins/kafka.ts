import fp from 'fastify-plugin'
import { Kafka, Producer, Consumer, Partitioners } from 'kafkajs'


export default fp(async (fastify) => {
  const kafka = new Kafka({
    clientId: 'fastify-app',
    brokers: ['localhost:9092'],
  })

  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  })

  await producer.connect()

  fastify.decorate('kafka', {
    client: kafka,
    producer,
    consumer: (groupId: string) =>
      kafka.consumer({ groupId }),
  })

  // graceful shutdown
  fastify.addHook('onClose', async () => {
    await producer.disconnect()
  })
}, {name: 'kafka'})

declare module 'fastify' {
    export interface FastifyInstance {
        kafka: {
            client: Kafka
            producer: Producer
            consumer: (groupId: string) => Consumer
          }
    }
}
