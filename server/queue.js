'use strict';

const { SQS } = require('aws-sdk');

class MessageQueue {
  constructor(queueName) {
    this.sqs = new SQS();
    this.queueURL = 'https://sqs.us-west-2.amazonaws.com/783478094927/packages.fifo';

    this.initializeQueue(queueName);
  }

  async initializeQueue(queueName) {
    try {
      const { QueueUrl } = await this.sqs.getQueueUrl({ QueueName: queueName }).promise();
      this.queueUrl = QueueUrl;
    } catch (error) {
      console.log(`Error initializing queue: ${error.message}`);
    }
  }

  async storeMessage(message) {
    if (!this.queueUrl) {
      console.error('Queue URL is not initialized');
      return;
    }

    const params = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(message),
      MessageGroupId: 'packages',
    };

    try {
      await this.sqs.sendMessage(params).promise();
    } catch (error) {
      console.log(`Error storing message: ${error.message}`);
    }
  }
}  

module.exports = MessageQueue;