import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import rationalFunctionsPaths from "../data/rational-functions-paths.json";
import Link from "next/link";

const Algebrite = require("algebrite");

const RationalFunctions: NextPage = () => {
  const [displayedText, setDisplayedText] = useState<string[]>([""]);
  const [numerator, setNumerator] = useState("x^2-1");
  const [denominator, setDenominator] = useState("x^2-2x-3");
  const [hasStarted, setHasStarted] = useState(false);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [graph, setGraph] = useState("");

  const getRoots = (algebriteRes: string) => {
    if (algebriteRes.includes("[")) {
      return algebriteRes
        .split(",")
        .filter((root) => !root.includes("i"))
        .map((root) => parseInt(root.replace(/[\[\]]/, "")));
    } else {
      // eslint-disable-next-line no-unused-vars
      return [parseInt(algebriteRes)];
    }
  };

  const handleStart = () => {
    setHasStarted(true);
    const paragraphsGen: string[] = [
      "When scouting out your opponent, you learn several things about them.",
    ];

    const simplified: string = Algebrite.run(
      `simplify((${numerator})/(${denominator}))`
    );

    const oNumRoots = getRoots(Algebrite.run(`roots(${numerator})`));
    const oDenomRoots = getRoots(Algebrite.run(`roots(${denominator})`));

    const holes = oNumRoots
      .filter((root) => oDenomRoots.includes(root))
      .map((hole) => [
        hole,
        +parseFloat(
          Algebrite.run(simplified.replaceAll(/x/g, hole.toString()))
        ).toFixed(2),
      ]);

    const sNum = Algebrite.run(`numerator(${simplified})`);
    const sDenom = Algebrite.run(`denominator(${simplified})`);

    // eslint-disable-next-line no-unused-vars
    // const hasHoles = parseInt(Algebrite.run(`deg(sNum) != deg(${numerator})`));

    const numDeg: number = parseInt(Algebrite.run(`deg(${sNum})`));
    const denomDeg: number = parseInt(Algebrite.run(`deg(${sDenom})`));

    if (isNaN(numDeg) || isNaN(denomDeg)) {
      // Error
      return;
    }

    const denomRootsResult: string = Algebrite.run(`roots(${sDenom})`);
    const VAs = getRoots(denomRootsResult);
    const numRootsResult: string = Algebrite.run(`roots(${sNum})`);
    const numRoots = getRoots(numRootsResult);

    // eslint-disable-next-line no-unused-vars
    const numConst = parseInt(Algebrite.run(`coeff(${sNum}, 0)`));
    // eslint-disable-next-line no-unused-vars
    const denomConst = parseInt(Algebrite.run(`coeff(${sDenom}, 0)`));

    Algebrite.run("x = 0");
    // eslint-disable-next-line no-unused-vars
    const yInt = parseInt(Algebrite.run(sNum));

    console.log({
      holes,
      numDeg,
      denomDeg,
      VAs,
      numRoots,
      numConst,
      denomConst,
    });

    if (holes.length > 0) {
      if (holes.length > 1) {
        paragraphsGen.push(
          `The opposing function has holes at ${holes
            .map((pair) => `(${pair[0]}, ${pair[1]})`)
            .join(
              ", "
            )}. This means that the numerator and denominator have common factors. They cancel out, making the shape of the graph simpler, but the denominator still equals 0 at that point.`
        );
      } else {
        paragraphsGen.push(
          `The opposing function has a hole at (${holes[0][0]}, ${holes[0][1]}). This means that the numerator and denominator have a common factor. They cancel out, making the shape of the graph simpler, but the denominator still equals 0 at that point.`
        );
      }
    } else {
      paragraphsGen.push(
        "The opposing function doesn't have holes. Their numerator and denominator don't have a common factor."
      );
    }

    const hasVAs = VAs.length > 0;
    if (hasVAs) {
      if (VAs.length > 1) {
        paragraphsGen.push(
          `The opposing rational function has vertical asymptotes at x = ${VAs.join(
            ", "
          )}. These are the locations where the denominator equals 0.`
        );
      } else {
        paragraphsGen.push(
          `The opposing rational function has a vertical asymptote at x = ${VAs[0]}. These is the location where the denominator equals 0.`
        );
      }
    } else {
      paragraphsGen.push(
        "The opposing function has no vertical asymptotes, which means that the denominator is never equal to 0."
      );
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
        paragraphsGen.push(
          "The opposing function has a horizontal asymptote at y = 0, this means the degree of the numerator is less than the degree of the denominator. Horizontal asymptote can be found by dividing the leading coefficient of numerator and denominator. If the numerator has a lower degree, then the leading coefficient is essentially 0."
        );
        break;
      case 1:
        paragraphsGen.push(
          `Since the degree of num and denom are equal, the graph has a horizontal asymptote at y = ${Algebrite.run(
            `printhuman((${numConst})/(${denomConst}))`
          )}, calculated by dividing the leading coefficients.`
        );
        break;
      case 2:
        paragraphsGen.push(
          "There is an oblique asymptote, the degree of the numerator is 1 greater than the denominator. If you try to divide the leading coefficients, it leads to a result of n/0, which does not exist."
        );
        break;
      case 3:
        paragraphsGen.push(
          "There might be another asymptote, the degree of the numerator is more than 2 greater than the denominator. If you try to divide the leading coefficients, it leads to a result of n/0, which does not exist."
        );
        break;
      case 4:
        paragraphsGen.push(
          "Interesting, the degree of their numerator is more than the degree of their denominator plus two! They probably have an asymptote of an unknown shape."
        );
        break;
    }

    paragraphsGen.push(
      "You use a spell called “desmosempra” to better illustrate this fact."
    );
    paragraphsGen.push("Desmosempra!");

    const graph = rationalFunctionsPaths[otherAsymptotes];

    setParagraphs(paragraphsGen);
    setGraph(graph);
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
      <h1 className="harry-potter">Function Duel</h1>
      <p>
        With the school-wide house competition coming up, you decide to register
        as it would be a great opportunity to practise your magic and meet new
        functions. This year, the event will be a magical talent show. The first
        to be able to perform magic that the opposing function cannot match will
        be the winner.
      </p>
      <p>
        You practice all your spells, and the day before the competition, the
        competitors are announced! You find out that your opponent is this
        rational function with numerator
        <Form.Control
          className="parameter"
          disabled={hasStarted}
          id="numerator"
          onChange={({ target: { value } }) => setNumerator(value)}
          type="text"
          value={numerator}
        />{" "}
        and denominator
        <Form.Control
          className="parameter"
          disabled={hasStarted}
          id="denominator"
          onChange={({ target: { value } }) => setDenominator(value)}
          type="text"
          value={denominator}
        />
        .
      </p>
      {!hasStarted ? (
        <Button disabled={hasStarted} onClick={handleStart} variant="primary">
          Start
        </Button>
      ) : null}
      {displayedText.map((paragraph, i) => (
        <p key={i.toString()}>{paragraph}</p>
      ))}
      {hasFinished ? (
        <div>
          <img alt="Equation graph" src={graph} />
          <p>
            You come up with a plan. You can target these asymptotes like a
            weakness, they will never be able to cast a spell in that location
            like you can!
          </p>
          <Link href="invertible-functions">
            <Button>Continue</Button>
          </Link>
        </div>
      ) : null}
    </Container>
  );
};

export default RationalFunctions;
