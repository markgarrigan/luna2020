const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../../helpers/db.js')

exports.handler = async function ({ body, headers }) {
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await db.add('orders', stripeEvent.data.object)
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object;
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = stripeEvent.data.object;
        // Then define and call a method to handle the successful attachment of a PaymentMethod.
        // handlePaymentMethodAttached(paymentMethod);
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
}