// Factory data structure for multi-factory system
export const factories = [
  {
    id: 1,
    name: "Chocolate Factory",
    type: "chocolate",
    email: "chocolate@karachibakery.com",
    password: "chocolate123",
    location: "Hyderabad",
    categories: ["Chocolate"],
    branches: [
      { id: 1, name: "Banjara Hills", code: "BH" },
      { id: 2, name: "Hi-Tech City", code: "HTC" },
      { id: 3, name: "Kondapur", code: "KDP" }
    ]
  },
  {
    id: 2,
    name: "Biscuit Factory 1",
    type: "biscuit",
    email: "biscuit1@karachibakery.com",
    password: "biscuit123",
    location: "Hyderabad",
    categories: ["Biscuits"],
    branches: [
      { id: 1, name: "Banjara Hills", code: "BH" },
      { id: 2, name: "Hi-Tech City", code: "HTC" },
      { id: 3, name: "Kondapur", code: "KDP" }
    ]
  },
  {
    id: 3,
    name: "Biscuit Factory 2",
    type: "biscuit",
    email: "biscuit2@karachibakery.com",
    password: "biscuit123",
    location: "Hyderabad",
    categories: ["Biscuits"],
    branches: [
      { id: 1, name: "Banjara Hills", code: "BH" },
      { id: 2, name: "Hi-Tech City", code: "HTC" },
      { id: 3, name: "Kondapur", code: "KDP" }
    ]
  },
  {
    id: 4,
    name: "Biscuit Factory 3",
    type: "biscuit",
    email: "biscuit3@karachibakery.com",
    password: "biscuit123",
    location: "Hyderabad",
    categories: ["Biscuits"],
    branches: [
      { id: 1, name: "Banjara Hills", code: "BH" },
      { id: 2, name: "Hi-Tech City", code: "HTC" },
      { id: 3, name: "Kondapur", code: "KDP" }
    ]
  },
  {
    id: 5,
    name: "Cake Factory",
    type: "cake",
    email: "cake@karachibakery.com",
    password: "cake123",
    location: "Hyderabad",
    categories: ["Cakes"],
    branches: [
      { id: 1, name: "Banjara Hills", code: "BH" },
      { id: 2, name: "Hi-Tech City", code: "HTC" },
      { id: 3, name: "Kondapur", code: "KDP" }
    ]
  },
  {
    id: 6,
    name: "Namkeen Factory",
    type: "namkeen",
    email: "namkeen@karachibakery.com",
    password: "namkeen123",
    location: "Hyderabad",
    categories: ["Namkeen"],
    branches: [
      { id: 1, name: "Banjara Hills", code: "BH" },
      { id: 2, name: "Hi-Tech City", code: "HTC" },
      { id: 3, name: "Kondapur", code: "KDP" }
    ]
  },
  {
    id: 7,
    name: "Sweet Factory",
    type: "sweets",
    email: "sweets@karachibakery.com",
    password: "sweets123",
    location: "Hyderabad",
    categories: ["Sweets"],
    branches: [
      { id: 1, name: "Banjara Hills", code: "BH" },
      { id: 2, name: "Hi-Tech City", code: "HTC" },
      { id: 3, name: "Kondapur", code: "KDP" }
    ]
  },
  {
    id: 8,
    name: "Gift Hamper Factory",
    type: "gift_hamper",
    email: "gift@karachibakery.com",
    password: "gift123",
    location: "Hyderabad",
    categories: ["Gift Hampers"],
    branches: [
      { id: 1, name: "Banjara Hills", code: "BH" },
      { id: 2, name: "Hi-Tech City", code: "HTC" },
      { id: 3, name: "Kondapur", code: "KDP" }
    ]
  }
];

// Factory routing logic
export const getFactoryForCategory = (category) => {
  const categoryMapping = {
    "Chocolate": "chocolate",
    "Biscuits": "biscuit",
    "Cakes": "cake",
    "Namkeen": "namkeen",
    "Sweets": "sweets",
    "Gift Hampers": "gift_hamper"
  };

  const factoryType = categoryMapping[category];
  if (!factoryType) return null;

  // For biscuits, randomly assign to one of the 3 factories
  if (factoryType === "biscuit") {
    const biscuitFactories = factories.filter(f => f.type === "biscuit");
    return biscuitFactories[Math.floor(Math.random() * biscuitFactories.length)];
  }

  return factories.find(f => f.type === factoryType);
};

// Get all factories for a given category
export const getFactoriesForCategory = (category) => {
  const categoryMapping = {
    "Chocolate": "chocolate",
    "Biscuits": "biscuit",
    "Cakes": "cake",
    "Namkeen": "namkeen",
    "Sweets": "sweets",
    "Gift Hampers": "gift_hamper"
  };

  const factoryType = categoryMapping[category];
  if (!factoryType) return [];

  return factories.filter(f => f.type === factoryType);
};
