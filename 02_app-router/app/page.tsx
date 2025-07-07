
"use client"

import React from "react";

export default function Home() {

  const [error, setErroe] = React.useState(false)

  const handleGetError = () => {
    setErroe(true)
  }

  return (
    <div>
      { error ? Error() : <button onClick={handleGetError}>try again</button>}
    </div>
  );
}
