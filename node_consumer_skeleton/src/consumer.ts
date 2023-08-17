import { Kafka } from "kafkajs";
import { v4 as uuidv4 } from "uuid";
const redpanda = new Kafka({
  brokers: [values.bootstrap-servers],
  ssl: {
    },
  sasl: {
    mechanism: values.sasl.mechanism,
    username: values.sasl.username,
    password: values.sasl.password
  }
});
const consumer = redpanda.consumer({ groupId: uuidv4() });
export async function connect() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: values.topic });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const formattedValue = JSON.parse(
          (message.value as Buffer).toString()
        );
        console.log(`${formattedValue.user}: ${formattedValue.message}`);
      },
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
export async function disconnect() {
  try {
    await consumer.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}