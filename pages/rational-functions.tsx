import type { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import rationalFunctionsPaths from "../data/rational-functions-paths.json";

const Algebrite = require("algebrite");

const RationalFunctions: NextPage = () => {
  const [displayedText, setDisplayedText] = useState<string[]>([""]);
  const [numerator, setNumerator] = useState("");
  const [denominator, setDenominator] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [equation, setEquation] = useState("");
  const [graph, setGraph] = useState("");

  const handleStart = () => {
    setHasStarted(true);
    const paragraphsGen: string[] = [];

    const simplified = Algebrite.run(
      `simplify((${numerator})/(${denominator}))`
    );

    const sNum = Algebrite.run(`numerator(${simplified})`);
    const sDenom = Algebrite.run(`denominator(${simplified})`);

    // eslint-disable-next-line no-unused-vars
    const hasHoles = parseInt(Algebrite.run(`deg(sNum) != deg(${numerator})`));

    const numDeg: number = parseInt(Algebrite.run(`deg(${sNum})`));
    const denomDeg: number = parseInt(Algebrite.run(`deg(${sDenom})`));

    if (isNaN(numDeg) || isNaN(denomDeg)) {
      // Error
      return;
    }

    const denomRootsResult: string = Algebrite.run(`roots(${sDenom})`);
    let VAs;
    if (denomRootsResult.includes("[")) {
      VAs = denomRootsResult
        .split(",")
        .filter((root) => !root.includes("i"))
        .map((root) => parseInt(root.replace(/[\[\]]/, "")));
    } else {
      // eslint-disable-next-line no-unused-vars
      VAs = [parseInt(denomRootsResult)];
    }
    const numRootsResult: string = Algebrite.run(`roots(${sNum})`);
    let numRoots;
    if (numRootsResult.includes("[")) {
      numRoots = numRootsResult
        .split(",")
        .filter((root) => !root.includes("i"))
        .map((root) => parseInt(root.replace(/[\[\]]/, "")));
    } else {
      // eslint-disable-next-line no-unused-vars
      numRoots = [parseInt(numRootsResult)];
    }

    // eslint-disable-next-line no-unused-vars
    const numConst = parseInt(Algebrite.run(`coeff(${sNum}, 0)`));
    // eslint-disable-next-line no-unused-vars
    const denomConst = parseInt(Algebrite.run(`coeff(${sDenom}, 0)`));

    Algebrite.run("x = 0");
    // eslint-disable-next-line no-unused-vars
    const yInt = parseInt(Algebrite.run(sNum));

    console.log({
      hasHoles,
      numDeg,
      denomDeg,
      VAs,
      numRoots,
      numConst,
      denomConst,
    });

    const hasVAs = VAs.length > 0;
    if (hasVAs) {
      paragraphsGen.push(
        `You have vertical asymptote(s) at x = ${VAs.join(", ")}`
      );
    } else {
      paragraphsGen.push("You have no vertical asymptotes");
    }

    const otherAsymptotes =
      numDeg < denomDeg
        ? 0 // horizontal at 0
        : numDeg === denomDeg
        ? 1 // horizontal at c
        : numDeg === denomDeg + 1
        ? 2 // oblique
        : numDeg === denomDeg + 2
        ? 3 // parabolic
        : 4; // other

    switch (otherAsymptotes) {
      case 0:
        paragraphsGen.push("You have a horizontal asymptote at y = 0");
        break;
      case 1:
        paragraphsGen.push(
          `Since the degree of num and denom are equal, you have a horizontal asymptote at y = ${Algebrite.run(
            `printhuman((${numConst})/(${denomConst}))`
          )}`
        );
        break;
      case 2:
        paragraphsGen.push("There is an oblique asymptote");
        break;
      case 3:
        paragraphsGen.push("There is a parabolic asymptote");
        break;
      case 4:
        paragraphsGen.push("There might be another asymptote");
        break;
    }

    const ending = rationalFunctionsPaths[hasVAs ? 1 : 0][otherAsymptotes];

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
          20
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
          20
        );
      }
    }
  }, [hasStarted, hasFinished, displayedText, paragraphs]);

  return (
    <Container className="mt-4">
      <h1 className="harry-potter">
        Families of Functions - Rational Functions
      </h1>
      <p>
        You are now in the magical world of Hogwarts - Rational Functions
        Edition. Please type your numerator and denominator polynomials.
      </p>
      {!hasStarted ? (
        <Form>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="numerator">Numerator</Form.Label>
            <Form.Control
              id="numerator"
              onChange={({ target: { value } }) => setNumerator(value)}
              type="text"
              value={numerator}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="denominator">Denominator</Form.Label>
            <Form.Control
              id="denominator"
              onChange={({ target: { value } }) => setDenominator(value)}
              type="text"
              value={denominator}
            />
          </Form.Group>
          <Button onClick={handleStart} variant="primary">
            Start
          </Button>
        </Form>
      ) : null}
      {displayedText.map((paragraph, i) => (
        <p key={i.toString()}>{paragraph}</p>
      ))}
      {hasFinished ? (
        <div>
          <p>{equation}</p>
          <Image alt="Equation graph" src={graph} width={200} height={200} />
        </div>
      ) : null}
    </Container>
  );
};

export default RationalFunctions;
