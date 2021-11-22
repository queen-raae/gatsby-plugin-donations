import Stripe from "stripe";
import {
  STRIPE_PRODUCT_ID,
  STRIPE_SECRET_KEY,
  STRIPE_PAYMENT_METHODS,
  STRIPE_CURRENCY,
  STRIPE_PRODUCT_NAME,
  STRIPE_PRODUCT_DESCRIPTION,
} from "./constants";

export default ({
  secretKey = STRIPE_SECRET_KEY,
  productId = STRIPE_PRODUCT_ID,
  paymentTypes = STRIPE_PAYMENT_METHODS || "card",
  currency = STRIPE_CURRENCY || "USD",
  productName = STRIPE_PRODUCT_NAME || "Donation",
  productDescription = STRIPE_PRODUCT_DESCRIPTION,
} = {}) => {
  const stripe = Stripe(secretKey);
  paymentTypes = paymentTypes.split(",").map((type) => type.trim());

  const log = (...args) => {
    console.log("Stripe:", ...args);
  };

  const createSession = async ({ amount, metadata, successUrl, cancelUrl }) => {
    log("createSession", metadata);

    // Stripe docs: https://stripe.com/docs/api/checkout/sessions/create
    const session = await stripe.checkout.sessions.create({
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: paymentTypes,
      line_items: [
        {
          price_data: {
            currency: currency,
            unit_amount: amount * 100,
            product: productId,
            product_data: !productId && {
              name: productName,
              description: productDescription,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: metadata,
    });

    return session;
  };

  return {
    createSession,
  };
};
