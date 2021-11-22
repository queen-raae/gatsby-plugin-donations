import React, { useState } from "react";
import axios from "axios";

const CURRENCY =
  process.env.GATSBY_RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_CURRENCY;

const Demo2 = () => {
  const [status, setStatus] = useState("initial");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setMessage("Calling stripe...");
      setStatus("pending");

      const {
        data: { url },
      } = await axios.post("/api/@raae/gatsby-plugin-donations/donation", {
        amount: event.target.elements.amount.value,
      });

      setMessage("Redirect to checkout...");

      window.location = url;
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
      setStatus("failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={status === "pending"}>
        <h2>Use custom onSumbit (without stripe-js)</h2>
        <p>
          <label htmlFor="amount">Amount {CURRENCY && `(${CURRENCY})`}: </label>
          <br />
          <input type="number" id="amount" name="amount" defaultValue="20" />
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

export default Demo2;
