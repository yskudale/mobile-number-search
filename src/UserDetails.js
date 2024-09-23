// src/UserDetails.js
import React, { useEffect, useState } from "react";

const UserDetails = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const payload = {
        params:
          "O3gp0EabEf1gGXi//kup4Je0pxjzTiY7xZpncmhiy55EjhDsqCIxG6QPuXj0DcBfFXQpjWBVmCJRQg9OErTGKrDD4rXu97XX5lpUGORJgkwcYO8pvCHPQMAXmcJQffBzvWpVIQ/dswsriXdwPGbJtRV9wsYdIVPGjcCdf52FcfXqW1/hUo0%2BDkr5B//kXc78eBFrTWbLpqAtXK1nEaHG08iBE3PfP5684hFXEdhYORvdCho%2BnfPdaef64JQzX1r9",
        sl: "cfcaf1d881a4af5d3e900ce114803f57",
        algf: "f0b5f9b5bfde26b7c441171639024485",
        sps: "697827acbbc8012df0300445dd0b552d",
      };

      try {
        const response = await fetch("/msisdngetServlet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Details</h1>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
};

export default UserDetails;
