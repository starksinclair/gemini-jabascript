// Pool of Trivia Questions
const triviaQuestions = [
  {
    question: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Avocado", "Onion", "Lime"],
    answer: "Avocado",
    difficulty: "easy",
  },
  {
    question: "Which country is considered the origin of pizza?",
    options: ["USA", "France", "Italy", "Greece"],
    answer: "Italy",
    difficulty: "easy",
  },
  {
    question: "What type of pasta is shaped like small butterflies?",
    options: ["Penne", "Fusilli", "Farfalle", "Rigatoni"],
    answer: "Farfalle",
    difficulty: "medium",
  },
  {
    question:
      "Saffron, the world's most expensive spice, comes from which flower?",
    options: ["Orchid", "Crocus", "Hibiscus", "Poppy"],
    answer: "Crocus",
    difficulty: "hard",
  },
  {
    question:
      "What is the primary ingredient in traditional Japanese miso soup?",
    options: ["Seaweed", "Tofu", "Soybean Paste", "Rice"],
    answer: "Soybean Paste",
    difficulty: "medium",
  },
  {
    question:
      "Which popular dessert consists of layers of ladyfingers dipped in coffee, mascarpone cheese, eggs, and sugar?",
    options: ["Cheesecake", "Crème Brûlée", "Cannoli", "Tiramisu"],
    answer: "Tiramisu",
    difficulty: "medium",
  },
  {
    question: "What gives sourdough bread its characteristic tangy flavor?",
    options: ["Yeast", "Vinegar", "Wild Yeast & Bacteria", "Lemon Juice"],
    answer: "Wild Yeast & Bacteria",
    difficulty: "hard",
  },
  {
    question:
      "Which cooking method involves submerging food in precisely temperature-controlled water?",
    options: ["Braising", "Poaching", "Sous Vide", "Steaming"],
    answer: "Sous Vide",
    difficulty: "medium",
  },
  {
    question: "Kimchi is a traditional fermented side dish from which country?",
    options: ["China", "Japan", "Vietnam", "Korea"],
    answer: "Korea",
    difficulty: "easy",
  },
  {
    question: "What type of pastry is used to make croissants?",
    options: [
      "Puff Pastry",
      "Shortcrust Pastry",
      "Phyllo Dough",
      "Laminated Dough",
    ],
    answer: "Laminated Dough",
    difficulty: "medium",
  },
  {
    question:
      "Which fruit is known as the 'king of fruits' and has a notoriously strong smell?",
    options: ["Mango", "Durian", "Jackfruit", "Papaya"],
    answer: "Durian",
    difficulty: "medium",
  },
  {
    question:
      "What is the French term for a mixture of finely diced vegetables (usually carrots, onions, celery) cooked slowly in butter or oil?",
    options: ["Julienne", "Brunoise", "Mirepoix", "Consommé"],
    answer: "Mirepoix",
    difficulty: "hard",
  },
  {
    question: "Which nut is used to make marzipan?",
    options: ["Peanut", "Walnut", "Almond", "Cashew"],
    answer: "Almond",
    difficulty: "easy",
  },
  {
    question: "What spirit is the primary ingredient in a Mojito cocktail?",
    options: ["Vodka", "Gin", "Tequila", "Rum"],
    answer: "Rum",
    difficulty: "easy",
  },
  {
    question:
      "'Umami' is considered the fifth basic taste. What does it generally translate to?",
    options: [
      "Spicy heat",
      "Savory/Meaty",
      "Bitter sharpness",
      "Sweet delight",
    ],
    answer: "Savory/Meaty",
    difficulty: "medium",
  },
];

// Pool of Food Facts & Bonus Questions
const foodFacts = [
  {
    fact: "Did you know that peanuts aren't actually nuts? They're legumes, belonging to the same family as beans and lentils!",
    bonusQuestion: "Which of these is also a legume?",
    options: ["Almond", "Walnut", "Chickpea", "Cashew"],
    answer: "Chickpea",
  },
  {
    fact: "Believe it or not, strawberries are not true berries, but bananas are! Botanically, berries have seeds on the inside.",
    bonusQuestion: "Which of these is botanically classified as a berry?",
    options: ["Raspberry", "Blackberry", "Watermelon", "Strawberry"],
    answer: "Watermelon",
  },
  {
    fact: "The most stolen food item in the world is cheese! It accounts for about 4% of all food stolen globally.",
    bonusQuestion:
      "Which country produces the famous 'Parmigiano-Reggiano' cheese?",
    options: ["France", "Switzerland", "Italy", "Netherlands"],
    answer: "Italy",
  },
  {
    fact: "White chocolate isn't technically chocolate because it contains no cocoa solids, only cocoa butter, sugar, and milk solids.",
    bonusQuestion: "What gives dark chocolate its characteristic bitter taste?",
    options: ["Sugar", "Cocoa Butter", "Milk Solids", "Cocoa Solids"],
    answer: "Cocoa Solids",
  },
  {
    fact: "An apple, potato, and onion all taste the same if you eat them while holding your nose. Taste is heavily influenced by smell!",
    bonusQuestion:
      "Which sense contributes most significantly to our perception of flavor?",
    options: ["Sight", "Touch", "Hearing", "Smell"],
    answer: "Smell",
  },
];

// Mock Leaderboard Data
const mockLeaderboard = [
  { name: "Chef Antoine", score: 1850 },
  { name: "Spatula Sam", score: 1700 },
  { name: "Grill Master Gary", score: 1680 },
  { name: "Baker Betty", score: 1550 },
  { name: "Sauce Boss Susan", score: 1400 },
];
