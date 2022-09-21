import type { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import paths from "../data/paths.json";
import * as d3 from "d3";

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
  parameters: Parameter[];
};

type Parameter = {
  symbol: string;
  min?: number;
  max?: number;
  value: number;
  requirements: Requirement[];
};

type D3SVG = d3.Selection<
  SVGGElement,
  [number, number][],
  HTMLElement,
  undefined
>;

type Requirement = "even" | "odd";

interface ParameterValues {
  [name: string]: number;
}

const parsedPaths = paths as Question;

const Graph: NextPage = () => {
  const [completedQuestions, setCompletedQuestions] = useState<SavedQuestion[]>(
    []
  );
  const [currentPath, setCurrentPath] = useState<Question | Equation>(
    parsedPaths
  );

  const [parameterValues, setParameterValues] = useState<ParameterValues>({});

  const handleOptionClick = (j: number) => {
    const currentQuestion = currentPath as Question;
    const newlySavedQuestion = {
      question: currentQuestion.question,
      options: currentQuestion.options.map((option) => option.name),
      chosenOption: j,
    };
    setCompletedQuestions([...completedQuestions, newlySavedQuestion]);

    const newPath = currentQuestion.options[j].child;
    setCurrentPath(newPath);

    if ("equation" in newPath) {
      newPath.parameters.forEach((parameter) => {
        if (!(parameter.symbol in parameterValues)) {
          setParameterValues({
            ...parameterValues,
            [parameter.symbol]: parameter.value,
          });
        }
      });
    }
  };

  const domain = [-10, 10];
  const margin = { top: 20, right: 50, bottom: 50, left: 50 };
  const width = 450 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const x = d3.scaleLinear().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);
  const graph = useRef<D3SVG>();
  const xAxisGroup = useRef<D3SVG>();
  const yAxisGroup = useRef<D3SVG>();
  const path =
    useRef<
      d3.Selection<SVGPathElement, [number, number][], HTMLElement, undefined>
    >();
  const line = d3
    .line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]));

  useEffect(() => {
    // Create plot
    const svg = d3
      .select("#root")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    graph.current = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + margin.left + "," + margin.top + ")"
      ) as D3SVG;

    path.current = graph.current.append("path");
  }, [height, margin.bottom, margin.left, margin.right, margin.top, width]);

  useEffect(() => {
    if ("equation" in currentPath) {
      let equation = currentPath.equation;
      Object.entries(parameterValues).forEach(([key, value]) => {
        equation = equation.replace(key, value.toString());
      });

      const f = (x: number) => {
        return eval(equation);
      };

      const data: [number, number][] = [];
      for (let xValue = domain[0]; xValue <= domain[1]; xValue += 0.1) {
        const yValue = f(xValue);
        data.push([xValue, yValue]);
      }

      x.domain([-10, 10]);
      y.domain([-10, 10]);

      xAxisGroup.current = graph
        .current!.append("g")
        .attr("transform", `translate(0,${y(0)})`);
      yAxisGroup.current = graph
        .current!.append("g")
        .attr("transform", `translate(${x(0)},0)`);

      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y);

      xAxis(xAxisGroup.current!);
      yAxis(yAxisGroup.current!);

      path
        .current!.attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "teal")
        .attr("stroke-width", 2);
      console.log("hi");
    }
  });

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
          <p>{currentPath.equation}</p>
          {currentPath.parameters.map((parameter) => {
            return (
              <Form.Control
                defaultValue={parameter.value}
                key={parameter.symbol}
                onChange={({ target }) =>
                  setParameterValues({
                    ...parameterValues,
                    [parameter.symbol]: parseInt(target.value),
                  })
                }
                min={parameter.min}
                max={parameter.max}
                type="number"
                value={parameterValues[parameter.symbol]}
              />
            );
          })}
        </>
      )}
      <svg
        id="root"
        onClick={() => setCurrentPath({ ...currentPath, equation: "x**3" })}
      ></svg>
    </>
  );
};

export default Graph;
