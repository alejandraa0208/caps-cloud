const AWS = require('aws-sdk');
const chance = require('chance')();
const { MessageQueue } = require('../server/queue');

AWS.config.update({ region: 'us-west-2' });

const sns = new AWS.SNS();
const sqs = new AWS.SQS();

const vendorQueueName = '1-800-flowers';
const pickupTopicArn = 'arn:aws:sns:us-west-2:783478094927:pickup.fifo';

const vendorQueue = new MessageQueue(vendorQueueName);

function handleDelivery(payload) {
  console.log('Thank you for delivering ' + payload.orderId);
}

function createPickup(storeName) {
  const pickupOrder = {
    store: storeName,
    orderId: chance.guid(),
    customer: chance.name(),
    address: chance.address(),
  };

  // Publish the pickup order to the SNS "pickup" topic
  sns.publish({
    TopicArn: pickupTopicArn,
    Message: JSON.stringify(pickupOrder),
  }, (err, data) => {
    if (err) {
      console.error('Error sending pickup message:', err);
    } else {
      console.log(`Sent pickup message with message ID: ${data.MessageId}`);
    }
  });

  return pickupOrder;
}

module.exports = {
  handleDelivery,
  createPickup,
};