import React from "react";
const CURRENCY =
  process.env.GATSBY_RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_CURRENCY;

const Demo1 = () => {
  return (
    <form action="/api/@raae/gatsby-plugin-donations/donation" method="POST">
      <fieldset>
        <h2>Use form action directly</h2>
        <p>
          <label htmlFor="amount">Amount {CURRENCY && `(${CURRENCY})`}: </label>
          <br />
          <input type="number" id="amount" name="amount" defaultValue="10" />
        </p>
        <p>
          <button>Donate</button>
        </p>
      </fieldset>
    </form>
  );
};

export default Demo1;
