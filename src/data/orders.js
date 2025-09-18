export const fakeOrders = [
  {
    id: 1,
    userId: 2,
    productId: 1,
    productName: "Karachi Famous Fruit Biscuits",
    quantity: 5,
    price: 450,
    total: 2250,
    status: "completed",
    orderDate: "2024-03-15",
    franchiseLocation: "Hyderabad Branch"
  },
  {
    id: 2,
    userId: 2,
    productId: 2,
    productName: "Premium Chocolate Cake",
    quantity: 2,
    price: 850,
    total: 1700,
    status: "pending",
    orderDate: "2024-03-16",
    franchiseLocation: "Hyderabad Branch"
  },
  {
    id: 3,
    userId: 4,
    productId: 4,
    productName: "Butter Cookies Box",
    quantity: 10,
    price: 380,
    total: 3800,
    status: "completed",
    orderDate: "2024-03-14",
    franchiseLocation: "Delhi Branch"
  },
  {
    id: 4,
    userId: 4,
    productId: 6,
    productName: "Mixed Pastries Tray",
    quantity: 3,
    price: 650,
    total: 1950,
    status: "shipped",
    orderDate: "2024-03-13",
    franchiseLocation: "Delhi Branch"
  }
];

export const generateOrderId = () => {
  return Math.floor(Math.random() * 10000) + 1000;
};