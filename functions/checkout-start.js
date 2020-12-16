const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function ({ body }) {
  // Create an array of products
  const items = body.items
  const line_items = Object.keys(items).map(key => {
    const line_item = {
      quantity: items[key].qty,
      price_data: {
        currency: 'usd',
        product_data: {
          name: items[key].name,
          description: items[key].description,
          images: [items[key].image]
        },
        unit_amount: Number(items[key].price)
      }
    }
    if (!line_item.price_data.product_data.description) {
      delete line_item.price_data.product_data.description
    }
    return line_item
  })
  const session = await stripe.checkout.sessions.create({
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    payment_intent_data: {
      capture_method: 'manual',
    },
    success_url: 'http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:8080/basket',
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ id: session.id })
  };
}