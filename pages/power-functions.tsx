import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import powerFunctionsPaths from "../data/power-functions-paths.json";
import Link from "next/link";

const Algebrite = require("algebrite");

type Sign = "positive" | "negative";
type Node = {
  message: string;
  requirement: string;
  children?: Node[];
  ending?: Ending;
};
type Ending = {
  equation: string;
  graph: string;
};

const equationsPath = powerFunctionsPaths as Node;

const PowerFunctions: NextPage = () => {
  const [displayedText, setDisplayedText] = useState<string[]>([""]);
  const [sign, setSign] = useState<Sign>("positive");
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [equation, setEquation] = useState("");
  const [graph, setGraph] = useState("");

  const handleStart = () => {
    setHasStarted(true);
    const paragraphsGen: string[] = [];
    let currentLocation = equationsPath;

    const signChar = sign === "positive" ? "+" : "-";
    Algebrite.run(`a = ${signChar}(${numerator}/${denominator})`);
    // eslint-disable-next-line no-unused-vars
    const m: number = parseInt(Algebrite.run("numerator(a)"));
    // eslint-disable-next-line no-unused-vars
    const n: number = parseInt(Algebrite.run("denominator(a)"));

    while (true) {
      paragraphsGen.push(currentLocation.message);
      if (currentLocation["children"] !== undefined) {
        for (const child of currentLocation.children) {
          if (eval(child.requirement)) {
            currentLocation = child;
            break;
          }
        }
      } else {
        break;
      }
    }

    const ending = currentLocation.ending!;

    // paragraphsGen.push(`${ending.house.toUpperCase()}!`)

    setParagraphs(paragraphsGen);
    setEquation(ending.equation);
    setGraph(ending.graph);
  };

  const hasFinished =
    displayedText.length === paragraphs.length &&
    displayedText[displayedText.length - 1].length ===
      paragraphs[paragraphs.length - 1].length;

  useEffect(() => {
    if (hasStarted && !hasFinished) {
      const lastDisplayedIndex = displayedText.length - 1;
      const lastDisplayedLetterIndex =
        displayedText[lastDisplayedIndex].length - 1;

      if (
        lastDisplayedLetterIndex ===
        paragraphs[lastDisplayedIndex].length - 1
      ) {
        setTimeout(
          () =>
            setDisplayedText([
              ...displayedText,
              paragraphs[lastDisplayedIndex + 1].charAt(0),
            ]),
          500
        );
      } else {
        setTimeout(
          () =>
            setDisplayedText([
              ...displayedText.slice(0, -1),
              displayedText[lastDisplayedIndex] +
                paragraphs[lastDisplayedIndex].charAt(
                  lastDisplayedLetterIndex + 1
                ),
            ]),
          10
        );
      }
    }
  }, [hasStarted, hasFinished, displayedText, paragraphs]);

  return (
    <Container className="mt-4">
      <h1 className="harry-potter">Power Function Sorting Quiz</h1>
      <p>
        He brought you to the Hogwarts For Magical Functions, and the next thing
        you know, you&apos;re sitting on a chair in front of the whole school
        with the magical function sorting hat on you.
      </p>
      <p>
        “Hmm… Difficult…. Very Difficult…”, the hat ponders, “a
        <Form.Select
          className="parameter"
          disabled={hasStarted}
          onChange={({ target: { value } }) => setSign(value as Sign)}
          value={sign}
        >
          <option value="positive">positive</option>
          <option value="negative">negative</option>
        </Form.Select>
        exponent I see, an exponent of
        <Form.Control
          className="parameter"
          disabled={hasStarted}
          id="numerator"
          min={0}
          onChange={({ target: { value } }) => setNumerator(parseInt(value))}
          step={1}
          type="number"
          value={numerator}
        />{" "}
        over
        <Form.Control
          className="parameter"
          disabled={hasStarted}
          id="denominator"
          min={1}
          onChange={({ target: { value } }) => setDenominator(parseInt(value))}
          step={1}
          type="number"
          value={denominator}
        />{" "}
        as well...”
      </p>
      <p>“I see you have a lot of promise...”</p>
      {!hasStarted ? (
        <Button disabled={hasStarted} onClick={handleStart} variant="primary">
          Start
        </Button>
      ) : (
        <p>
          y = x^({sign === "negative" ? "-" : null}
          {Algebrite.run(`${numerator}/${denominator}`)})
        </p>
      )}
      {displayedText.map((paragraph, i) => (
        <p key={i.toString()}>{paragraph}</p>
      ))}
      {hasFinished ? (
        <div>
          <p>Meet one of the other functions in your house: {equation}</p>
          <Image alt="Equation graph" src={graph} width={200} height={200} />
          <br />
          <Link href="rational-functions">
            <Button>Continue</Button>
          </Link>
        </div>
      ) : null}
    </Container>
  );
};

export default PowerFunctions;
