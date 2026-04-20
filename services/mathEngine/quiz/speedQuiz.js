const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateSpeedQuestion = (difficulty) => {
  const speed = rand(20, 80);
  const time = rand(1, 5);

  const distance = speed * time;

  return {
    question: `A car travels at ${speed} km/h for ${time} hours. Find distance.`,
    answer: distance,
    topic: "speed_distance",
    difficulty,
    solution: {
      formula: "Distance = Speed × Time",
      steps: [
        `${speed} × ${time}`,
        `= ${distance}`,
      ],
      answer: distance,
    },
  };
};

export default generateSpeedQuestion;