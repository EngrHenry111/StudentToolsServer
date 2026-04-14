export const formatResponse = ({
  topic,
  formula,
  steps,
  answer,
  relatedTopics = [],
}) => {
  return {
    success: true,
    topic: topic || "Unknown",
    formula: formula || "",
    steps: Array.isArray(steps) ? steps : [],
    answer: answer ?? "",
    relatedTopics,
  };
};


// export const formatResponse = ({
//   topic,
//   formula,
//   steps,
//   answer,
//   relatedTopics = [],
// }) => {
//   return {
//     success: true,
//     topic,
//     formula,
//     steps,
//     answer,
//     relatedTopics,
//   };
// };