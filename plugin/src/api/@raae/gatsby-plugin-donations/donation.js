import createError from "http-errors";
import Joi from "joi";

import Stripe from "./../lib/stripe";

const stripe = Stripe();

/**
 * Checkout handler, used to create Stripe checkout sessions (POST).
 *
 */

export default async (req, res) => {
  console.log(`${req.baseUrl} - ${req.method}`);

  // The api_key is available on process.env because it's set in gatsby-node => onPreInit
  console.log("process.env.api_key: ", process.env.api_key);

  try {
    if (req.method === "POST") {
      await createStripeSession(req, res);
    } else {
      throw createError(405, `${req.method} not allowed`);
    }
  } catch (error) {
    if (Joi.isError(error)) {
      error = createError(422, error);
    }

    let status = error.statusCode || 500;
    let message = error.message;

    // Something went wrong, log it
    console.error(`${status} -`, message);

    // Respond with error code and message
    res.status(status).json({
      message: error.expose ? message : `Faulty ${req.baseUrl}`,
    });
  }
};

/**
 * Create a Stripe checkout session the donated amount
 *
 * @param  {string} req.body.amount Amount to be donated
 * @param  {string} req.body.successUrl Passed to Stripe checkout session
 * @param  {string} req.body.cancelUrl Passed to Stripe checkout session
 */

const createStripeSession = async (req, res) => {
  const defaultSuccessUrl = `${req.headers.origin}/?success=true`;
  const defaultCancelUrl = `${req.headers.origin}/?canceled=true`;

  // 1. Validate the data coming in
  const schema = Joi.object({
    amount: Joi.number().required(),
    successUrl: Joi.string().default(defaultSuccessUrl),
    cancelUrl: Joi.string().default(defaultCancelUrl),
    metadata: Joi.object(),
  }).required();

  const values = await schema.validateAsync(req.body);

  // 2. Create a Stripe Checkout Session with the Github username as metadata
  const session = await stripe.createSession(values);

  // 3. Response with url to session url
  if (req.headers[`sec-fetch-mode`] === "navigate") {
    res.redirect(session.url);
  } else {
    res.json(session);
  }
};
