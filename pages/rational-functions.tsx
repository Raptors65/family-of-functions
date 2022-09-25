import type { NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import rationalFunctionsPaths from "../data/rational-functions-paths.json";

const Algebrite = require("algebrite");

const RationalFunctions: NextPage = () => {
  const [displayedText, setDisplayedText] = useState<string[]>([""]);
  const [numerator, setNumerator] = useState("x^2-1");
  const [denominator, setDenominator] = useState("x^2-2x-3");
  const [hasStarted, setHasStarted] = useState(false);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [equation, setEquation] = useState("");
  const [graph, setGraph] = useState("");

  const handleStart = () => {
    setHasStarted(true);
    const paragraphsGen: string[] = [
      'Throughout your entire life, you, Harry Potter, have been experiencing weird function magic. One day, a hairy function came over to your house and said the words that changed your life: "Yer a rational function, Harry." You\'re now at the sorting ceremony where they sort new rational functions into houses, and unexpectedly, the magical function sorting hat talks to you.',
      '"Hmm, difficult. VERY difficult."',
      '"First, let\'s try to simplify you to see if you have any holes and to accurately assess your shape."',
    ];

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

    if (hasHoles) {
      paragraphsGen.push(
        '"You have holes, I see. Your numerator and denominator have a common factor."'
      );
    } else {
      paragraphsGen.push(
        "\"You don't have holes, I see. Your numerator and denominator don't have a common factor.\""
      );
    }

    const hasVAs = VAs.length > 0;
    if (hasVAs) {
      if (VAs.length > 1) {
        paragraphsGen.push(
          `"And you have vertical asymptotes at x = ${VAs.join(
            ", "
          )} because your denominator has a root there."`
        );
      } else {
        paragraphsGen.push(
          `"And you have a vertical asymptote at x = ${VAs[0]} because your denominator has a root there."`
        );
      }
    } else {
      paragraphsGen.push(
        '"And you have no vertical asymptotes because your denominator has no roots."'
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
          '"Since the degree of your numerator is less than the degree of your denominator, you have a horizontal asymptote at y = 0."'
        );
        break;
      case 1:
        paragraphsGen.push(
          `Since the degree of your numerator and denominator are equal, you have a horizontal asymptote at y = ${Algebrite.run(
            `printhuman((${numConst})/(${denomConst}))`
          )}, which is your numerator's constant term over your denominator's constant term.`
        );
        break;
      case 2:
        paragraphsGen.push(
          '"Since the degree of your numerator is one more than the degree of your denominator, you have an oblique asymptote."'
        );
        break;
      case 3:
        paragraphsGen.push(
          '"Since the degree of your numerator is two more than the degree of your denominator, you have a parabolic asymptote."'
        );
        break;
      case 4:
        paragraphsGen.push(
          '"You\'re rare, the degree of your numerator is more than the degree of your denominator plus two! You probably have an interestingly shaped asymptote."'
        );
        break;
    }

    const ending =
      rationalFunctionsPaths[hasHoles ? 1 : 0][hasVAs ? 1 : 0][otherAsymptotes];

    paragraphsGen.push(
      `You will be placed in the house of... ${ending.house.toUpperCase()}!`
    );

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
          10
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
          500
        );
      }
    }
  }, [hasStarted, hasFinished, displayedText, paragraphs]);

  return (
    <Container className="mt-4">
      <h1 className="harry-potter">Function Duel</h1>
      <p>
        You are now in the magical world of Hogwarts - Rational Functions
        Edition. Please type your numerator and denominator polynomials.
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
          <p>Meet another member of your house: {equation}</p>
          <Image alt="Equation graph" src={graph} width={200} height={200} />
        </div>
      ) : null}
    </Container>
  );
};

export default RationalFunctions;
