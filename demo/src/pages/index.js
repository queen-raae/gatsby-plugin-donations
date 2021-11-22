import React, { useEffect, useState } from "react";

import Demo1 from "../../components/demo1";
import Demo2 from "../../components/demo2";
import Demo3 from "../../components/demo3";

const IndexPage = ({ location }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(location.search);
    if (query.get("success")) {
      setMessage("Donation succeded -- thank you 🎉");
    }

    if (query.get("canceled")) {
      setMessage("Donation canceled -- try again when you’re ready.");
    }
  }, [location.search]);

  return (
    <main>
      <header>
        <h1>
          <span role="img" aria-label="Party popper emoji">
            🎉&nbsp;
          </span>
          Gatsby Plugin Donations Demo
          <span role="img" aria-label="Party popper emoji">
            &nbsp;🎉
          </span>
        </h1>
        <p>{message}</p>
      </header>
      <br />
      <section>
        <Demo1 />
      </section>
      <br />
      <section>
        <Demo2 />
      </section>
      <br />
      <section>
        <Demo3 />
      </section>
    </main>
  );
};

export default IndexPage;
