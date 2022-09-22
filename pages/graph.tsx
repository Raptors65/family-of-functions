import type { NextPage } from "next";
import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
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
  parameters: Parameters;
  requirements: "noninteger"[];
};

interface Parameters {
  [symbol: string]: Parameter;
}

type Parameter = {
  min?: number;
  max?: number;
  step?: number;
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

const parsedPaths = paths as Question;

const Graph: NextPage = () => {
  const [completedQuestions, setCompletedQuestions] = useState<SavedQuestion[]>(
    []
  );
  const [currentPath, setCurrentPath] = useState<Question | Equation>(
    parsedPaths
  );

  const [parameters, setParameters] = useState<Parameters>({});

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
      setParameters(newPath.parameters);
    }
  };

  const handleParameterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    symbol: string
  ) => {
    setParameters({
      ...parameters,
      [symbol]: {
        ...parameters[symbol],
        value: parseInt(event.target.value),
      },
    });
  };

  const domain = [-10, 10];
  const margin = { top: 20, right: 50, bottom: 50, left: 50 };
  const width = 450 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const x = d3.scaleLinear().domain([-10, 10]).range([0, width]);
  const y = d3.scaleLinear().domain([-10, 10]).range([height, 0]);
  x.domain([-10, 10]);
  y.domain([-10, 10]);
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
      const data: [number, number][] = [];

      // Only render data if all parameters are valid
      if (
        Object.entries(parameters).every(
          ([symbol, { min, max, requirements, value }]) =>
            requirements.every((requirement) => {
              switch (requirement) {
                case "even":
                  return value % 2 === 0;
                case "odd":
                  return value % 2 === 1;
              }
            }) &&
            (min === undefined || value >= min) &&
            (max === undefined || value <= max) &&
            currentPath.requirements.every((requirement) => {
              switch (requirement) {
                case "noninteger":
                  return !Number.isInteger(
                    parameters.m.value / parameters.n.value
                  );
              }
            })
        )
      ) {
        let equation = currentPath.equation;
        Object.entries(parameters).forEach(([key, { value }]) => {
          equation = equation.replace(key, value.toString());
        });

        const f = (x: number) => {
          return eval(equation);
        };

        let wasLastValueOk = false;
        // Generate points
        for (let xValue = domain[0]; xValue <= domain[1]; xValue += 0.01) {
          const yValue = f(xValue);
          // if y value is in graph
          if (yValue >= domain[0] - 1 && yValue <= domain[1] + 1) {
            // if last y value was not in graph, stil draw it so line appears complete
            if (!wasLastValueOk) {
              // ...as long as the previous x value is also in the graph
              if (xValue !== domain[0]) {
                const previousYValue = f(xValue - 0.1);
                if (isFinite(previousYValue))
                  data.push([xValue - 0.1, previousYValue]);
              }
              wasLastValueOk = true;
            }
            data.push([xValue, yValue]);
          } else {
            if (wasLastValueOk) {
              // if y value is not in graph but previous was, draw it so line is complete
              data.push([xValue, yValue]);
              wasLastValueOk = false;
            } /* else if (yValue < domain[0] - 2) {
              data.push([xValue, domain[0] - 20]);
            } else if (yValue > domain[1] + 2) {
              data.push([xValue, domain[1] + 20]);
            }*/
          }
        }
      }
      console.log(data);

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
        .current!.attr("fill", "none")
        .attr("stroke", "teal")
        .attr("stroke-width", 2)
        /* .transition()
        .duration(3000)*/
        .attr("d", line(data));
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
          {Object.entries(currentPath.parameters).map(([symbol, parameter]) => {
            return (
              <Form.Control
                key={symbol}
                onChange={(e) =>
                  handleParameterChange(
                    e as React.ChangeEvent<HTMLInputElement>,
                    symbol
                  )
                }
                min={parameter.min}
                max={parameter.max}
                step={parameter.step}
                type="number"
                value={parameters[symbol].value}
              />
            );
          })}
        </>
      )}
      <svg id="root"></svg>
    </>
  );
};

export default Graph;
