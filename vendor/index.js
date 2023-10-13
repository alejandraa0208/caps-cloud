const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-west-2' });

// Configure AWS SNS and SQS here

// Vendor will post "pickup" messages containing delivery information into the SNS pickup topic
const vendorData = {
  orderId: 1234,
  customer: 'Jane Doe',
  vendorUrl: '<Your Vendor SQS URL>',
};

const params = {
  MessageBody: JSON.stringify(vendorData),
  QueueUrl: '<Your SNS Pickup Topic ARN>',
};

sqs.sendMessage(params, (err, data) => {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Message sent:', data.MessageId);
  }
});
