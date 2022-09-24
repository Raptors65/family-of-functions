import type { NextPage } from "next";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const Home: NextPage = () => {
  return (
    <Container className="mt-4">
      <h1 className="harry-potter">Enter the World of Magical Functions!</h1>
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
