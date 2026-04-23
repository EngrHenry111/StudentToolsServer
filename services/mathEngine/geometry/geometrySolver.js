import { parseGeometry } from "../../mathEngine/geometry/geometryParser.js";
import { formatResponse } from "../../formatter.js";

const solveGeometry = (problem) => {
  const parsed = parseGeometry(problem);

  if (!parsed) return { error: "Invalid geometry problem" };

  let steps = [];
  let answer;

  if (parsed.type === "area_rectangle") {
    answer = parsed.length * parsed.width;

    steps = [
      `Formula: Area = Length × Width`,
      `Length = ${parsed.length}`,
      `Width = ${parsed.width}`,
      `${parsed.length} × ${parsed.width} = ${answer}`,
    ];
  }

  if (parsed.type === "perimeter_rectangle") {
    answer = 2 * (parsed.length + parsed.width);

    steps = [
      `Formula: Perimeter = 2(L + W)`,
      `Length = ${parsed.length}`,
      `Width = ${parsed.width}`,
      `2(${parsed.length} + ${parsed.width}) = ${answer}`,
    ];
  }

  return formatResponse({
    topic: "Geometry",
    formula: "Area / Perimeter",
    steps,
    answer,
  });
};

export default solveGeometry;