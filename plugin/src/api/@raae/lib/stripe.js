import Stripe from "stripe";
import {
  STRIPE_PRODUCT_ID,
  STRIPE_SECRET_KEY,
  STRIPE_PAYMENT_METHODS,
  STRIPE_CURRENCY,
  STRIPE_PRODUCT_NAME,
  STRIPE_PRODUCT_DESCRIPTION,
  STRIPE_AMOUNT_MULTIPLIER,
} from "./constants";

export default ({
  secretKey = STRIPE_SECRET_KEY,
  productId = STRIPE_PRODUCT_ID,
  paymentTypes = STRIPE_PAYMENT_METHODS || "card",
  currency = STRIPE_CURRENCY || "USD",
  multiplier = STRIPE_AMOUNT_MULTIPLIER || 100,
  productName = STRIPE_PRODUCT_NAME || "Donation",
  productDescription = STRIPE_PRODUCT_DESCRIPTION,
} = {}) => {
  const stripe = Stripe(secretKey);
  paymentTypes = paymentTypes.split(",").map((type) => type.trim());

  const log = (...args) => {
    console.log("Stripe:", ...args);
  };

  const createSession = async ({ amount, metadata, successUrl, cancelUrl }) => {
    log("createSession", amount, metadata, productId);

    const priceData = {
      currency: currency,
      unit_amount: amount * parseInt(multiplier, 10),
    };

    if (productId) {
      priceData.product = productId;
    } else {
      priceData.product_data = {
        name: productName,
        description: productDescription,
      };
    }

    // Stripe docs: https://stripe.com/docs/api/checkout/sessions/create
    const session = await stripe.checkout.sessions.create({
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_method_types: paymentTypes,
      line_items: [
        {
          price_data: priceData,
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
