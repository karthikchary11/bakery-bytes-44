// Factory orders data structure
export const generateFactoryOrderId = () => {
  return `FO${Date.now()}`;
};

// Sample factory orders data
export const fakeFactoryOrders = [
  {
    id: "FO1703123456789",
    originalOrderId: "ORD1703123456788",
    factoryId: 1,
    factoryName: "Chocolate Factory",
    factoryType: "chocolate",
    branchId: 1,
    branchName: "Banjara Hills",
    branchCode: "BH",
    franchiseId: 2,
    franchiseName: "Franchise 1",
    franchiseLocation: "Banjara Hills",
    products: [
      {
        id: 7,
        name: "Premium Chocolate Box",
        quantity: 2,
        price: 750,
        category: "Chocolate"
      }
    ],
    totalAmount: 1500,
    orderDate: "2024-01-15",
    status: "pending", // pending, packed, shipped, delivered
    packedDate: null,
    packedBy: null,
    notes: "Handle with care - fragile items"
  },
  {
    id: "FO1703123456790",
    originalOrderId: "ORD1703123456788",
    factoryId: 2,
    factoryName: "Biscuit Factory 1",
    factoryType: "biscuit",
    branchId: 1,
    branchName: "Banjara Hills",
    branchCode: "BH",
    franchiseId: 2,
    franchiseName: "Franchise 1",
    franchiseLocation: "Banjara Hills",
    products: [
      {
        id: 1,
        name: "Karachi Famous Fruit Biscuits",
        quantity: 3,
        price: 450,
        category: "Biscuits"
      },
      {
        id: 4,
        name: "Butter Cookies Box",
        quantity: 1,
        price: 380,
        category: "Biscuits"
      }
    ],
    totalAmount: 1730,
    orderDate: "2024-01-15",
    status: "packed",
    packedDate: "2024-01-16",
    packedBy: "Factory Worker 1",
    notes: "Standard packaging"
  },
  {
    id: "FO1703123456791",
    originalOrderId: "ORD1703123456788",
    factoryId: 5,
    factoryName: "Cake Factory",
    factoryType: "cake",
    branchId: 2,
    branchName: "Hi-Tech City",
    branchCode: "HTC",
    franchiseId: 3,
    franchiseName: "Franchise 2",
    franchiseLocation: "Hi-Tech City",
    products: [
      {
        id: 2,
        name: "Premium Chocolate Cake",
        quantity: 1,
        price: 850,
        category: "Cakes"
      }
    ],
    totalAmount: 850,
    orderDate: "2024-01-15",
    status: "pending",
    packedDate: null,
    packedBy: null,
    notes: "Keep refrigerated"
  },
  {
    id: "FO1703123456792",
    originalOrderId: "ORD1703123456789",
    factoryId: 6,
    factoryName: "Namkeen Factory",
    factoryType: "namkeen",
    branchId: 3,
    branchName: "Kondapur",
    branchCode: "KDP",
    franchiseId: 4,
    franchiseName: "Franchise 3",
    franchiseLocation: "Kondapur",
    products: [
      {
        id: 8,
        name: "Namkeen Mix",
        quantity: 5,
        price: 320,
        category: "Namkeen"
      }
    ],
    totalAmount: 1600,
    orderDate: "2024-01-16",
    status: "packed",
    packedDate: "2024-01-17",
    packedBy: "Factory Worker 2",
    notes: "Bulk order - priority"
  },
  {
    id: "FO1703123456793",
    originalOrderId: "ORD1703123456790",
    factoryId: 7,
    factoryName: "Sweet Factory",
    factoryType: "sweets",
    branchId: 1,
    branchName: "Banjara Hills",
    branchCode: "BH",
    franchiseId: 2,
    franchiseName: "Franchise 1",
    franchiseLocation: "Banjara Hills",
    products: [
      {
        id: 9,
        name: "Sweet Box (1kg)",
        quantity: 2,
        price: 450,
        category: "Sweets"
      }
    ],
    totalAmount: 900,
    orderDate: "2024-01-17",
    status: "pending",
    packedDate: null,
    packedBy: null,
    notes: "Fresh sweets - pack same day"
  },
  {
    id: "FO1703123456794",
    originalOrderId: "ORD1703123456791",
    factoryId: 8,
    factoryName: "Gift Hamper Factory",
    factoryType: "gift_hamper",
    branchId: 2,
    branchName: "Hi-Tech City",
    branchCode: "HTC",
    franchiseId: 3,
    franchiseName: "Franchise 2",
    franchiseLocation: "Hi-Tech City",
    products: [
      {
        id: 10,
        name: "Gift Hamper Premium",
        quantity: 1,
        price: 1200,
        category: "Gift Hampers"
      }
    ],
    totalAmount: 1200,
    orderDate: "2024-01-18",
    status: "packed",
    packedDate: "2024-01-19",
    packedBy: "Factory Worker 3",
    notes: "Gift wrapping required"
  }
];

// Helper functions for factory orders
export const getFactoryOrdersByFactory = (factoryId) => {
  return fakeFactoryOrders.filter(order => order.factoryId === factoryId);
};

export const getFactoryOrdersByBranch = (factoryId, branchId) => {
  return fakeFactoryOrders.filter(order => 
    order.factoryId === factoryId && order.branchId === branchId
  );
};

export const getFactoryOrdersByStatus = (factoryId, status) => {
  return fakeFactoryOrders.filter(order => 
    order.factoryId === factoryId && order.status === status
  );
};

export const updateFactoryOrderStatus = (orderId, status, packedBy = null) => {
  const orderIndex = fakeFactoryOrders.findIndex(order => order.id === orderId);
  if (orderIndex !== -1) {
    fakeFactoryOrders[orderIndex].status = status;
    if (status === 'packed') {
      fakeFactoryOrders[orderIndex].packedDate = new Date().toISOString().split('T')[0];
      fakeFactoryOrders[orderIndex].packedBy = packedBy;
    }
  }
  return fakeFactoryOrders[orderIndex];
};
