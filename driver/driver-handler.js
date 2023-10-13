const { MessageQueue } = require('../server/queue');

const driverQueueName = 'driver';
const driverQueue = new MessageQueue(driverQueueName);

function handlePickup(payload) {
  console.log('DRIVER: picked up ' + payload.orderId);

  // Simulate delivery by processing the payload
  setTimeout(() => {
    console.log('DRIVER: delivered up ' + payload.orderId);

    // Post a message to the Vendor's "delivered" Queue using the provided URL
    driverQueue.storeMessage({
      orderId: payload.orderId,
      customer: payload.customer,
      vendorUrl: payload.vendorUrl,
    });
  }, 5000);
}

module.exports = handlePickup;
