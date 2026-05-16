const detectIntent = (text) => {

  if (text.includes("find")) return "find";
  if (text.includes("calculate")) return "calculate";
  if (text.includes("solve")) return "solve";
  if (text.includes("what is")) return "find";

  return "general";
};

export default detectIntent;