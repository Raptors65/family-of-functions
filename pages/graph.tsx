import type { NextPage } from "next";
import Image from "next/image";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import paths from "../data/paths.json";

type SavedQuestion = {
  question: string;
  options: string[];
  chosenOption: number;
};

type Question = {
  question: string;
  options: Option[];
};

type Option = {
  name: string;
  child: Question | Equation;
};

type Equation = {
  equation: string;
};

const parsedPaths = paths as Question;

const Equations: NextPage = () => {
  const [completedQuestions, setCompletedQuestions] = useState<SavedQuestion[]>(
    []
  );
  const [currentPath, setCurrentPath] = useState<Question | Equation>(
    parsedPaths
  );

  const handleOptionClick = (j: number) => {
    const currentQuestion = currentPath as Question;
    const newlySavedQuestion = {
      question: currentQuestion.question,
      options: currentQuestion.options.map((option) => option.name),
      chosenOption: j,
    };
    setCompletedQuestions([...completedQuestions, newlySavedQuestion]);
    setCurrentPath(currentQuestion.options[j].child);
  };

  return (
    <>
      <h1>Hi</h1>
      {completedQuestions.map(({ question, options, chosenOption }, i) => (
        <div className="saved-question" key={i}>
          <p>{question}</p>
          {options.map((option, j) => (
            <Form.Check key={`${i}-${j}`}>
              <Form.Check.Input
                checked={j === chosenOption}
                id={`${i}-${j}`}
                readOnly
                type="radio"
              />
              <Form.Check.Label htmlFor={`${i}-${j}`}>
                {option}
              </Form.Check.Label>
            </Form.Check>
          ))}
        </div>
      ))}
      {"question" in currentPath ? (
        <div className="current-question">
          <p>{currentPath.question}</p>
          {currentPath.options.map(({ name }, j) => (
            <Form.Check key={`${completedQuestions.length}-${j}`}>
              <Form.Check.Input
                defaultChecked={false}
                id={`new-${j}`}
                onClick={() => handleOptionClick(j)}
                type="radio"
              />
              <Form.Check.Label htmlFor={`new-${j}`}>{name}</Form.Check.Label>
            </Form.Check>
          ))}
        </div>
      ) : (
        <>
          <Image
            alt="Graph"
            src={`/${completedQuestions
              .map((question) => question.chosenOption)
              .join("-")}.png`}
            width={710}
            height={441}
          />
          <p>{currentPath.equation}</p>
        </>
      )}
    </>
  );
};

export default Equations;
