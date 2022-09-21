import type { NextPage } from "next";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const Home: NextPage = () => {
  return (
    <Container fluid className="bg-light py-5">
      <h1>Flowcharts</h1>
      <Link href="/graph">
        <Button>Get Started</Button>
      </Link>
    </Container>
  );
};

export default Home;
