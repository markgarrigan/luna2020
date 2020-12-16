const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function ({ body }) {
  const session = await stripe.checkout.sessions.retrieve(body.session_id, {
    expand: ['customer', 'line_items']
  });
  return {
    statusCode: 200,
    body: JSON.stringify(session)
  };
}