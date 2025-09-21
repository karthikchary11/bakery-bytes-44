export const fakeOrders = [
  {
    id: 1,
    orderId: "ORD001",
    outletId: 2,
    outletName: "Rajesh Kumar",
    branchLocation: "Hyderabad - Banjara Hills",
    branchId: "HYD001",
    items: [
      {
        productId: 1,
        productName: "Premium Dark Chocolate",
        category: "chocolates",
        quantity: 10,
        price: 250,
        factoryId: "CHOC001",
        factoryName: "Chocolate Factory - Unit 1"
      }
    ],
    totalAmount: 2500,
    status: "pending", // pending, confirmed, packed, shipped, delivered
    orderDate: "2024-03-20T10:30:00Z",
    confirmedAt: null,
    packedAt: null,
    shippedAt: null,
    deliveredAt: null,
    notes: "Urgent delivery required"
  },
  {
    id: 2,
    orderId: "ORD002",
    outletId: 3,
    outletName: "Priya Sharma",
    branchLocation: "Mumbai - Andheri West",
    branchId: "MUM001",
    items: [
      {
        productId: 5,
        productName: "Special Birthday Cake",
        category: "cakes",
        quantity: 3,
        price: 800,
        factoryId: "CAKE001",
        factoryName: "Cake Factory - Unit 1"
      },
      {
        productId: 2,
        productName: "Butter Cookies Premium",
        category: "biscuits",
        quantity: 15,
        price: 180,
        factoryId: "BISC001",
        factoryName: "Biscuit Factory - Unit 1"
      }
    ],
    totalAmount: 5100,
    status: "confirmed",
    orderDate: "2024-03-19T14:15:00Z",
    confirmedAt: "2024-03-19T15:30:00Z",
    packedAt: null,
    shippedAt: null,
    deliveredAt: null,
    notes: null
  },
  {
    id: 3,
    orderId: "ORD003",
    outletId: 4,
    outletName: "Amit Singh",
    branchLocation: "Delhi - Connaught Place",
    branchId: "DEL001",
    items: [
      {
        productId: 8,
        productName: "Mixed Namkeen Platter",
        category: "namkeens",
        quantity: 20,
        price: 320,
        factoryId: "NAMK001",
        factoryName: "Namkeen Factory - Unit 1"
      }
    ],
    totalAmount: 6400,
    status: "packed",
    orderDate: "2024-03-18T09:45:00Z",
    confirmedAt: "2024-03-18T11:00:00Z",
    packedAt: "2024-03-19T16:20:00Z",
    shippedAt: null,
    deliveredAt: null,
    notes: "Handle with care"
  },
  {
    id: 4,
    orderId: "ORD004",
    outletId: 2,
    outletName: "Rajesh Kumar",
    branchLocation: "Hyderabad - Banjara Hills",
    branchId: "HYD001",
    items: [
      {
        productId: 9,
        productName: "Gulab Jamun Tray",
        category: "sweets",
        quantity: 8,
        price: 450,
        factoryId: "SWET001",
        factoryName: "Sweet Factory - Unit 1"
      },
      {
        productId: 10,
        productName: "Festival Gift Hamper",
        category: "gift_hampers",
        quantity: 5,
        price: 1200,
        factoryId: "HAMP001",
        factoryName: "Gift Hamper Factory - Unit 1"
      }
    ],
    totalAmount: 9600,
    status: "shipped",
    orderDate: "2024-03-17T16:30:00Z",
    confirmedAt: "2024-03-17T17:45:00Z",
    packedAt: "2024-03-18T10:15:00Z",
    shippedAt: "2024-03-18T18:30:00Z",
    deliveredAt: null,
    notes: null
  },
  {
    id: 5,
    orderId: "ORD005",
    outletId: 3,
    outletName: "Priya Sharma",
    branchLocation: "Mumbai - Andheri West",
    branchId: "MUM001",
    items: [
      {
        productId: 3,
        productName: "Coconut Cookies",
        category: "biscuits",
        quantity: 25,
        price: 160,
        factoryId: "BISC002",
        factoryName: "Biscuit Factory - Unit 2"
      }
    ],
    totalAmount: 4000,
    status: "delivered",
    orderDate: "2024-03-15T12:20:00Z",
    confirmedAt: "2024-03-15T13:30:00Z",
    packedAt: "2024-03-16T09:45:00Z",
    shippedAt: "2024-03-16T15:20:00Z",
    deliveredAt: "2024-03-17T11:10:00Z",
    notes: "Customer very satisfied"
  }
];

export const generateOrderId = () => {
  return `ORD${String(Math.floor(Math.random() * 9000) + 1000)}`;
};