import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.GATSBY_RAAE_PLUGIN_DONATIONS_STRIPE_PUBLISHABLE_KEY
);

const CURRENCY =
  process.env.GATSBY_RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_CURRENCY;

const Demo3 = () => {
  const [status, setStatus] = useState("initial");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setMessage("Calling stripe...");
      setStatus("pending");

      const {
        data: { id },
      } = await axios.post("/api/@raae/gatsby-plugin-donations/donation", {
        amount: event.target.elements.amount.value,
      });

      setMessage("Redirect to checkout...");

      const stripe = await stripePromise;
      stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setStatus("failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={status === "pending"}>
        <h2>Use custom onSumbit (with stripe-js)</h2>
        <p>
          <label htmlFor="amount">Amount {CURRENCY && `(${CURRENCY})`}: </label>
          <br />
          <input type="number" id="amount" name="amount" defaultValue="30" />
        </p>
        <p>
          <button>Donate</button>
        </p>

        <p>
          <small>{message}</small>
        </p>
      </fieldset>
    </form>
  );
};

export default Demo3;
