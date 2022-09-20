import type { NextPage } from "next";

const Algebrite = require("algebrite");

const Equations: NextPage = () => {
  console.log(Algebrite.run("x^2+2x+1==(x+1)^2+1"));
  return <h1>Hi</h1>;
};

export default Equations;
