import { Kafka } from "kafkajs";
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
const admin = redpanda.admin();
export async function createTopic(
  topic: string,
  partitions?: number,
  replicas?: number
) {
  await admin.connect();
  const existingTopics = await admin.listTopics();
  if (!existingTopics.includes(topic)) {
    await admin.createTopics({
      topics: [
        {
          topic: topic,
          numPartitions: partitions ? partitions : 1,
          replicationFactor: replicas ? replicas : 1,
        },
      ],
    });
  }
  await admin.disconnect();
}