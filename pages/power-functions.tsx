import type { NextPage } from "next";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import equations from "../data/equations.json";
import styles from "./power-functions.module.css";

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

const equationsPath = equations as Node;

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
    setParagraphs(paragraphsGen);
    setEquation(ending.equation);
    setGraph(ending.graph);
  };

  const hasFinished =
    displayedText.length === paragraphs.length &&
    displayedText[displayedText.length - 1].length ===
      paragraphs[paragraphs.length - 1].length;

  useEffect(() => {
    document.body.classList.add(styles.body);
  }, []);

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
      <h1 className={styles.harryPotter}>
        Families of Functions - Power Functions
      </h1>
      <p>
        You are now in the magical world of Hogwarts - Power Functions Edition.
        Please choose your exponent.
      </p>
      {!hasStarted ? (
        <Form>
          <Form.Group className="mb-3">
            <Form.Select
              onChange={({ target: { value } }) => setSign(value as Sign)}
              value={sign}
            >
              <option value="positive">&#43;</option>
              <option value="negative">&minus;</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="numerator">Numerator</Form.Label>
            <Form.Control
              id="numerator"
              min={0}
              onChange={({ target: { value } }) =>
                setNumerator(parseInt(value))
              }
              step={1}
              type="number"
              value={numerator}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="denominator">Denominator</Form.Label>
            <Form.Control
              id="denominator"
              min={1}
              onChange={({ target: { value } }) =>
                setDenominator(parseInt(value))
              }
              step={1}
              type="number"
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

export default PowerFunctions;
