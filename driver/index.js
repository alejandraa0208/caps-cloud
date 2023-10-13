const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ region: 'us-east-1' }); // Change the region as needed

// Configure AWS SNS and SQS here

// Poll the 'packages' queue and retrieve the delivery orders
function pollPackages() {
  const params = {
    QueueUrl: '<https://sqs.us-west-2.amazonaws.com/783478094927/packages.fifo>',
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
  };

  sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.log('Error:', err);
      return;
    }

    if (data.Messages) {
      const message = JSON.parse(data.Messages[0].Body);
      console.log('DRIVER: picked up ' + message.orderId);

      // Simulate delivery after a time
      setTimeout(() => {
        console.log('DRIVER: delivered ' + message.orderId);

        // Post a message to the Vendor's "delivered" Queue
        const deliveredData = {
          orderId: message.orderId,
          // Add other delivery details as needed
        };

        const deliveredParams = {
          MessageBody: JSON.stringify(deliveredData),
          QueueUrl: message.vendorUrl, // Use the vendor's SQS URL from the message
        };

        sqs.sendMessage(deliveredParams, (err, data) => {
          if (err) {
            console.log('Error:', err);
          } else {
            console.log('Delivery message sent:', data.MessageId);
          }
        });
      }, 5000);
    }
  });
}

pollPackages();
