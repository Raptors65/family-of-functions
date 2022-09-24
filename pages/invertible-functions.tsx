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
        When looking around your house, you notice that some functions call
        themselves &quot;invertible&quot;. Your house members won&apos;t tell
        you what it means. However, one of your new friends tells you to use
        something called the HLTFMF (Horizontal Line Test for Magical
        Functions). She tells you to plot yourself on a graph, which you learned
        how to do with a spell called &quot;desmosempra,&quot; and then see if
        any two points on your graph fall on the same horizontal line.
      </p>
      <p>
        <Link href="https://www.desmos.com/calculator">
          <a>Desmosempra!</a>
        </Link>
      </p>
      <p>
        You also learn that there are ways to earn the certificate of
        invertibility. Luckily, you have managed to find some top secretslides
        that teach you how to earn this highly coveted honour.
      </p>
      <iframe
        src="https://docs.google.com/presentation/d/e/2PACX-1vS0YIbV0gdmDhZ41-BpaZw7qIF8biORv2RQ6NZ21HegyxmBMNBre6vBprVrf7XbAkj_8wBS4o4S_88-/embed?start=false&loop=true&delayms=15000"
        frameBorder={0}
        width={960}
        height={569}
        allowFullScreen={true}
      ></iframe>
    </Container>
  );
};

export default InvertibleFunctions;
