export const fakeOrders = [
  {
    id: 1,
    userId: 2,
    products: [
      { id: 1, name: "Karachi Famous Fruit Biscuits", quantity: 5, price: 450 },
      { id: 2, name: "Premium Chocolate Cake", quantity: 2, price: 850 }
    ],
    totalAmount: 3950,
    status: "completed",
    orderDate: "2024-03-15",
    franchiseLocation: "Hyderabad Branch"
  },
  {
    id: 2,
    userId: 2,
    products: [
      { id: 3, name: "Butter Cookies Box", quantity: 3, price: 380 },
      { id: 4, name: "Mixed Pastries Tray", quantity: 2, price: 650 }
    ],
    totalAmount: 2440,
    status: "pending",
    orderDate: "2024-03-16",
    franchiseLocation: "Hyderabad Branch"
  },
  {
    id: 3,
    userId: 4,
    products: [
      { id: 1, name: "Karachi Famous Fruit Biscuits", quantity: 10, price: 450 },
      { id: 5, name: "Chocolate Chip Cookies", quantity: 5, price: 320 }
    ],
    totalAmount: 6100,
    status: "completed",
    orderDate: "2024-03-14",
    franchiseLocation: "Delhi Branch"
  },
  {
    id: 4,
    userId: 4,
    products: [
      { id: 6, name: "Mixed Pastries Tray", quantity: 3, price: 650 },
      { id: 7, name: "Premium Chocolate Cake", quantity: 1, price: 850 }
    ],
    totalAmount: 2800,
    status: "shipped",
    orderDate: "2024-03-13",
    franchiseLocation: "Delhi Branch"
  },
  {
    id: 5,
    userId: 2,
    products: [
      { id: 8, name: "Namkeen Mix", quantity: 4, price: 320 },
      { id: 9, name: "Sweet Box", quantity: 2, price: 450 }
    ],
    totalAmount: 2180,
    status: "completed",
    orderDate: "2024-03-12",
    franchiseLocation: "Hyderabad Branch"
  }
];

export const generateOrderId = () => {
  return Math.floor(Math.random() * 10000) + 1000;
};