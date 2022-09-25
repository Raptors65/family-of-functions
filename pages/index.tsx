import type { NextPage } from "next";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const Home: NextPage = () => {
  return (
    <Container className="mt-4">
      <h1 className="harry-potter">Enter the World of Magical Functions!</h1>
      <p className="mb-4 names">By Andy, Lucas, and Stanley</p>
      <p>Welcome to the magical world of Hogwarts - Power Functions Edition!</p>
      <p>
        As a child, you have always experienced weird function magic. People
        would say a number to you, and you’d instantly give out another. People
        saw you launch yourself up and down along different curves and seemingly
        never stop until you were out of your domain. You were the outcast of
        the town, the “weird function child”.
      </p>
      <p>
        One day, a very big and hairy function came over to your house and
        banged heavily on the door. You ran to open it because you thought that
        if you didn’t he would’ve knocked the door down himself anyways. You
        stared into the giant beast of a function in front of you as he said the
        words that will change your life: “Yer a power function, Harry.”
      </p>
      <Link href="/power-functions">
        <Button className="mx-2" variant="primary">
          Power Functions
        </Button>
      </Link>
      <Link href="/rational-functions">
        <Button className="mx-2" variant="secondary">
          Rational Functions
        </Button>
      </Link>
      <Link href="/invertible-functions">
        <Button className="mx-2" variant="danger">
          Invertible Functions
        </Button>
      </Link>
    </Container>
  );
};

export default Home;
