import biscuitsImage from '../assets/biscuits-collection.jpg';
import cakesImage from '../assets/cakes-collection.jpg';
import breadsImage from '../assets/breads-pastries.jpg';

export const fakeProducts = [
  // Chocolates
  {
    id: 1,
    name: "Premium Dark Chocolate",
    description: "Rich dark chocolate with 70% cocoa content",
    price: 250,
    image: cakesImage,
    category: "chocolates",
    stock: 150,
    sold: 89,
    factoryOptions: [
      { factoryId: "CHOC001", factoryName: "Chocolate Factory - Unit 1" }
    ]
  },
  
  // Biscuits (3 factories available)
  {
    id: 2,
    name: "Karachi Famous Fruit Biscuits",
    description: "Our signature fruit biscuits made with premium ingredients",
    price: 450,
    image: biscuitsImage,
    category: "biscuits",
    stock: 300,
    sold: 156,
    factoryOptions: [
      { factoryId: "BISC001", factoryName: "Biscuit Factory - Unit 1" },
      { factoryId: "BISC002", factoryName: "Biscuit Factory - Unit 2" },
      { factoryId: "BISC003", factoryName: "Biscuit Factory - Unit 3" }
    ]
  },
  {
    id: 3,
    name: "Butter Cookies Premium",
    description: "Crispy butter cookies made with pure ghee",
    price: 380,
    image: biscuitsImage,
    category: "biscuits",
    stock: 250,
    sold: 167,
    factoryOptions: [
      { factoryId: "BISC001", factoryName: "Biscuit Factory - Unit 1" },
      { factoryId: "BISC002", factoryName: "Biscuit Factory - Unit 2" },
      { factoryId: "BISC003", factoryName: "Biscuit Factory - Unit 3" }
    ]
  },
  {
    id: 4,
    name: "Coconut Cookies",
    description: "Fresh coconut cookies with tropical flavors",
    price: 160,
    image: biscuitsImage,
    category: "biscuits",
    stock: 180,
    sold: 123,
    factoryOptions: [
      { factoryId: "BISC001", factoryName: "Biscuit Factory - Unit 1" },
      { factoryId: "BISC002", factoryName: "Biscuit Factory - Unit 2" },
      { factoryId: "BISC003", factoryName: "Biscuit Factory - Unit 3" }
    ]
  },

  // Cakes
  {
    id: 5,
    name: "Premium Chocolate Cake",
    description: "Rich chocolate cake perfect for celebrations",
    price: 850,
    image: cakesImage,
    category: "cakes",
    stock: 50,
    sold: 89,
    factoryOptions: [
      { factoryId: "CAKE001", factoryName: "Cake Factory - Unit 1" }
    ]
  },
  {
    id: 6,
    name: "Birthday Special Cake",
    description: "Customizable birthday cakes with fresh cream",
    price: 1200,
    image: cakesImage,
    category: "cakes",
    stock: 30,
    sold: 45,
    factoryOptions: [
      { factoryId: "CAKE001", factoryName: "Cake Factory - Unit 1" }
    ]
  },

  // Namkeens
  {
    id: 7,
    name: "Spicy Mixture",
    description: "Traditional spicy mixture with nuts and lentils",
    price: 280,
    image: breadsImage,
    category: "namkeens",
    stock: 200,
    sold: 145,
    factoryOptions: [
      { factoryId: "NAMK001", factoryName: "Namkeen Factory - Unit 1" }
    ]
  },
  {
    id: 8,
    name: "Mixed Namkeen Platter",
    description: "Assorted namkeens perfect for gatherings",
    price: 320,
    image: breadsImage,
    category: "namkeens",
    stock: 120,
    sold: 87,
    factoryOptions: [
      { factoryId: "NAMK001", factoryName: "Namkeen Factory - Unit 1" }
    ]
  },

  // Sweets
  {
    id: 9,
    name: "Gulab Jamun Tray",
    description: "Soft and sweet gulab jamuns in sugar syrup (per kg)",
    price: 450,
    image: cakesImage,
    category: "sweets",
    stock: 80,
    sold: 67,
    unit: "kg",
    factoryOptions: [
      { factoryId: "SWET001", factoryName: "Sweet Factory - Unit 1" }
    ]
  },
  {
    id: 10,
    name: "Rasgulla Special",
    description: "Fresh rasgullas made with cottage cheese (per tray)",
    price: 380,
    image: cakesImage,
    category: "sweets",
    stock: 60,
    sold: 43,
    unit: "tray",
    factoryOptions: [
      { factoryId: "SWET001", factoryName: "Sweet Factory - Unit 1" }
    ]
  },

  // Gift Hampers
  {
    id: 11,
    name: "Festival Gift Hamper",
    description: "Premium gift hamper with assorted sweets and snacks",
    price: 1200,
    image: breadsImage,
    category: "gift_hampers",
    stock: 40,
    sold: 28,
    factoryOptions: [
      { factoryId: "HAMP001", factoryName: "Gift Hamper Factory - Unit 1" }
    ]
  },
  {
    id: 12,
    name: "Corporate Gift Box",
    description: "Elegant gift box for corporate events",
    price: 1500,
    image: breadsImage,
    category: "gift_hampers",
    stock: 25,
    sold: 15,
    factoryOptions: [
      { factoryId: "HAMP001", factoryName: "Gift Hamper Factory - Unit 1" }
    ]
  }
];

export const productCategories = [
  {
    id: "chocolates",
    name: "Chocolates",
    description: "Premium quality chocolates",
    factoryCount: 1
  },
  {
    id: "biscuits", 
    name: "Biscuits",
    description: "Fresh and crispy biscuits",
    factoryCount: 3
  },
  {
    id: "cakes",
    name: "Cakes",
    description: "Fresh baked cakes for all occasions",
    factoryCount: 1
  },
  {
    id: "namkeens",
    name: "Namkeens",
    description: "Spicy and savory snacks",
    factoryCount: 1
  },
  {
    id: "sweets",
    name: "Sweets",
    description: "Traditional Indian sweets",
    factoryCount: 1
  },
  {
    id: "gift_hampers",
    name: "Gift Hampers",
    description: "Curated gift collections",
    factoryCount: 1
  }
];