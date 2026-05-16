export const extractVariables = (text) => {
  const variables = {};

  const patterns = {
    mass: /mass\s*(is|=)?\s*(\d+(\.\d+)?)/,
    force: /force\s*(is|=)?\s*(\d+(\.\d+)?)/,
    acceleration: /acceleration\s*(is|=)?\s*(\d+(\.\d+)?)/,
    speed: /speed\s*(is|=)?\s*(\d+(\.\d+)?)/,
    time: /time\s*(is|=)?\s*(\d+(\.\d+)?)/,
    distance: /distance\s*(is|=)?\s*(\d+(\.\d+)?)/,
    length: /length\s*(is|=)?\s*(\d+(\.\d+)?)/,
    width: /width\s*(is|=)?\s*(\d+(\.\d+)?)/,
    radius: /radius\s*(is|=)?\s*(\d+(\.\d+)?)/,
    principal: /p\s*=?\s*(\d+)/,
    rate: /r\s*=?\s*(\d+)/,
    timeSI: /t\s*=?\s*(\d+)/,
  };

  for (const key in patterns) {
    const match = text.match(patterns[key]);

    if (match) {
      variables[key] = parseFloat(match[2]);
    }
  }

  return variables;
};