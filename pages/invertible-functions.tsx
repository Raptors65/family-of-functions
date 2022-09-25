import type { NextPage } from "next";
import Link from "next/link";
import Container from "react-bootstrap/Container";

const InvertibleFunctions: NextPage = () => {
  return (
    <Container className="mt-4">
      <h1 className="harry-potter">Invertibility</h1>
      <p>
        You think you are very well prepared and set to win this competition.
        However, when you start looking around your house, you notice that some
        functions are calling themselves “invertible”. Rumors are circulating
        that many functions are looking to invert themselves as a trick for the
        upcoming competition.
      </p>
      <p>
        In order to win yourself, you need to make sure that you can also invert
        yourself, but you don’t know if you are capable of that. Luckily, one of
        your new friends tells you to use something called the HLTFMF
        (Horizontal Line Test for Magical Functions). She tells you to plot
        yourself on a graph, which you learned how to do with a spell called
        “desmosempra,” and then see if any two points on your graph fall on the
        same horizontal line.
      </p>
      <p>
        <Link href="https://www.desmos.com/calculator">
          <a>Desmosempra!</a>
        </Link>
      </p>
      <iframe
        src="https://www.desmos.com/calculator/"
        width={1200}
        height={600}
        frameBorder={0}
        className="desmos"
      ></iframe>
      <p>
        You also learn that there are ways to earn the certificate of
        invertibility. Luckily, you have managed to find some top secret slides
        that teach you how to earn this highly coveted honour.
      </p>
      <iframe
        src="https://docs.google.com/presentation/d/e/2PACX-1vS0YIbV0gdmDhZ41-BpaZw7qIF8biORv2RQ6NZ21HegyxmBMNBre6vBprVrf7XbAkj_8wBS4o4S_88-/embed?start=false&loop=false&delayms=3000"
        frameBorder={0}
        width={960}
        height={569}
        allowFullScreen={true}
      ></iframe>
    </Container>
  );
};

export default InvertibleFunctions;
