import { PrismaClient } from "@prisma/client";
import {Kafka} from "kafkajs"
const TOPIC_NAME = 'zap-events'
const client = new PrismaClient()
const kafka = new Kafka ({
    clientId: 'outbox-processor',
    brokers : ['localhost:9092']
})
async function main() {
    const producer = kafka.producer()
    while (1) {
        const pendingRows = await client.zapRunOutbox.findMany({
            where : {},
            take :10
        })
        pendingRows.forEach(r => {})
    }
}