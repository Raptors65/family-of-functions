import type { NextPage } from "next";
import Link from "next/link";
import Container from "react-bootstrap/Container";

const InvertibleFunctions: NextPage = () => {
  return (
    <Container className="mt-4">
      <h1 className="harry-potter">
        Families of Functions - Invertible Functions
      </h1>
      <p>
        When looking around your house, you notice that some houses call
        themselves &quot;invertible&quot;. Your house members won&apos;t tell
        you what your house is. However, one of your new friends tells you to
        use something called the HLTFMF (Horizontal Line Test for Magical
        Functions). She tells you to plot yourself on a graph, which you learned
        how to do with a spell called &quot;desmosempra,&quot; and then see if
        any two points on your graph fall on the same horizontal line.
      </p>
      <p>
        <Link href="https://www.desmos.com/calculator">
          <a>Desmosempra!</a>
        </Link>
      </p>
    </Container>
  );
};

export default InvertibleFunctions;
