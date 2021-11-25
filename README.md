# Gatsby Plugin Donations

> A Gatsby Plugin for accepting donations through Stripe 💰

**Beta notice:** The plugin is in active development, and I am looking for beta users/testers. Leave a comment on [this discussion thread](https://github.com/queen-raae/gatsby-plugin-donations/discussions/10) if that is you.

Gatsby Plugin Donation adds the endpoint `/api/@raae/gatsby-plugin-donations/donation` to your site, making it possible to accept donations of any amount through a Stripe Checkout Session created on the server.

## A message from Queen [@raae](https://twitter.com/raae)

Learn how to get the most out of Gatsby and **stay updated** on the plugin by [subscribing](https://queen.raae.codes/emails/?utm_source=readme&utm_campaign=plugin-donations) to emails from yours truly.

## How to install

`npm install @raae/gatsby-plugin-donations`

or

`yarn add @raae/gatsby-plugin-donations`

## How to configure

Add `gatsby-plugin-donations` to the plugin array in `gatsby-config.js`.

```
// gatsby-config.js

module.exports = {
  plugins: [
    `@raae/gatsby-plugin-donations`
  ],
}
```

Configuration for Gatsby Plugin Donations is done using environment variables. We'll move to plugin options as soon as that is [technically possible](https://github.com/gatsbyjs/gatsby/discussions/34047) for our use case.

### Environment variables

| Env var                                                        | Type   | Default      | Description                                                                                                                                              |
| -------------------------------------------------------------- | ------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_SECRET_KEY                 | string | `undefined`  | **[required]** Your Stripe Secret Key                                                                                                                    |
| GATSBY_RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_PAYMENT_METHODS     | string | `"card"`     | Comma seperated list of [Stripe Payment Method Types](https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-payment_method_types) |
| GATSBY_RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_CURRENCY            | string | `"USD"`      | The currency of the donations                                                                                                                            |
| GATSBY_RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_AMOUNT_MULTIPLIER   | number | `100`        | If your input us in USD, then the multiplier should be 100 to get to cents; the accepted Stripe unit.                                                    |
| GATSBY_RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_PRODUCT_ID          | string | `undefined`  | The id of the product to tie the donation to, will also be the content of the checkout page                                                              |
| GATSBY_RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_PRODUCT_NAME        | string | `"Donation"` | If no product, this will be the product name used                                                                                                        |
| GATSBY_RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_PRODUCT_DESCRIPTION | string | `undefined`  | If no product, this will be the product description used                                                                                                 |

## How to use

Send a POST request to `/api/@raae/gatsby-plugin-donations/donation` with the parameters listed below.

If possible the endpoint will redirect automatically to the created Stripe Checkout Session. If not you'll upack the response and redirect manually, see [the examples](#examples).

### Parameters

| name       | Type   | Default                                | Description                                                                                      |
| ---------- | ------ | -------------------------------------- | ------------------------------------------------------------------------------------------------ |
| amount     | number | `undefined`                            | The amount, will be multiplied with GATSBY_RAAE_GATSBY_PLUGIN_DONATIONS_STRIPE_AMOUNT_MULTIPLIER |
| successUrl | string | `${req.headers.origin}/?success=true`  | The page to redirect to after the donation succeeds                                              |
| cancelUrl  | string | `${req.headers.origin}/?canceled=true` | The page to redirect to if the donation is cancelled                                             |

### Examples

#### Use form action directly

```js
<form action="/api/@raae/gatsby-plugin-donations/donation" method="POST">
  <fieldset>
    <p>
      <label htmlFor="amount">Amount: </label>
      <br />
      <input type="number" id="amount" name="amount" defaultValue="10" />
    </p>
    <p>
      <button>Donate</button>
    </p>
  </fieldset>
</form>
```

#### Use custom onSumbit (without stripe-js)

```js
const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    setMessage("Calling Stripe...");
    setStatus("pending");

    const {
      data: { url },
    } = await axios.post("/api/@raae/gatsby-plugin-donations/donation", {
      amount: event.target.elements.amount.value,
    });

    setMessage("Redirect to Stripe Checkout...");

    window.location = url;
  } catch (error) {
    setMessage(error.response?.data?.message || error.message);
    setStatus("failed");
  }
};
```

#### Use custom onSumbit (with stripe-js)

```js
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

    const stripe = await loadStripe(`<Your Stripe Publishable Key>`);
    stripe.redirectToCheckout({ sessionId: id });
  } catch (error) {
    setMessage(error.response?.data?.message || error.message);
    setStatus("failed");
  }
};
```
