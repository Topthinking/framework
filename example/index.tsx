import { render, useState } from "../src";

const app = () => {
  const [v, setV] = useState(1);
  console.log("render>>>");
  return (
    <h1
      onClick={() => {
        setV(Math.random());
      }}
    >
      打开控制台，点击试试看 {v}
    </h1>
  );
};

render(app, document.getElementById("root"));
