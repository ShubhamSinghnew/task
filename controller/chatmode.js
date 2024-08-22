import Chat from '../model/chatmode.js';
import amqp from 'amqplib';

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertQueue('chat_messages');
}

connectRabbitMQ();

export const sendMessage = async (data) => {
  const { user, message } = data;
  const chatMessage = new Chat({ user, message });
  await chatMessage.save();

  channel.sendToQueue('chat_messages', Buffer.from(JSON.stringify(data)));

  return data;
};

export const getMessages = async () => {
  const messages = await Chat.find().sort({ timestamp: -1 });
  return messages;
};
