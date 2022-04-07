import * as React from "react";
import * as ReactDOM from "react-dom/client";

const Page = () => {
  return <h1>createRoot</h1>;
};
const container:Element = document.getElementById("root");
const root = ReactDOM.createRoot(container);

root.render(<Page />);

