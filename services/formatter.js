export const formatResponse = ({
  topic,
  formula,
  steps,
  answer,
  relatedTopics = [],
}) => {
  return {
    success: true,
    topic,
    formula,
    steps,
    answer,
    relatedTopics,
  };
};