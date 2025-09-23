// Comprehensive Factory Dashboard Data - Past 1 Month
// This file contains realistic fake data for testing the complete factory dashboard

export const factoryDashboardData = {
  // Factory Information
  factory: {
    id: 1,
    name: "Biscuit Factory 1",
    type: "Biscuit",
    email: "biscuit1@karachibakery.com",
    location: "Hyderabad",
    branches: [
      { id: 1, name: "Main Branch", code: "BF1-MAIN", location: "Hyderabad Central" },
      { id: 2, name: "North Branch", code: "BF1-NORTH", location: "Hyderabad North" },
      { id: 3, name: "South Branch", code: "BF1-SOUTH", location: "Hyderabad South" }
    ]
  },

  // Past 1 Month Factory Orders (30 days of data)
  factoryOrders: [
    // Week 1 - Recent orders
    {
      id: "FO-2024-001",
      originalOrderId: "ORD-2024-001",
      factoryId: 1,
      branchId: 1,
      branchName: "Main Branch",
      branchCode: "BF1-MAIN",
      franchiseId: 2,
      franchiseName: "Franchise Owner A",
      franchiseLocation: "Hyderabad Branch",
      products: [
        { id: 1, name: "Karachi Famous Fruit Biscuits", quantity: 10, price: 450, category: "Biscuits" },
        { id: 2, name: "Cashew Biscuit Premium", quantity: 5, price: 380, category: "Biscuits" }
      ],
      totalAmount: 6400,
      orderDate: "2024-12-15T10:30:00Z",
      status: "pending",
      priority: "medium",
      packedDate: null,
      packedBy: null,
      notes: "Urgent order for weekend rush"
    },
    {
      id: "FO-2024-002",
      originalOrderId: "ORD-2024-002",
      factoryId: 1,
      branchId: 2,
      branchName: "North Branch",
      branchCode: "BF1-NORTH",
      franchiseId: 4,
      franchiseName: "Franchise Owner C",
      franchiseLocation: "Delhi Branch",
      products: [
        { id: 3, name: "Osmania Biscuit", quantity: 8, price: 320, category: "Biscuits" },
        { id: 4, name: "Pista Biscuit", quantity: 6, price: 420, category: "Biscuits" }
      ],
      totalAmount: 5680,
      orderDate: "2024-12-15T14:20:00Z",
      status: "packed",
      priority: "high",
      packedDate: "2024-12-15T16:45:00Z",
      packedBy: "Factory Worker 1",
      notes: "Premium customer order"
    },
    {
      id: "FO-2024-003",
      originalOrderId: "ORD-2024-003",
      factoryId: 1,
      branchId: 1,
      branchName: "Main Branch",
      branchCode: "BF1-MAIN",
      franchiseId: 2,
      franchiseName: "Franchise Owner A",
      franchiseLocation: "Hyderabad Branch",
      products: [
        { id: 5, name: "Chand Biscuit", quantity: 12, price: 280, category: "Biscuits" }
      ],
      totalAmount: 3360,
      orderDate: "2024-12-14T09:15:00Z",
      status: "delivered",
      priority: "low",
      packedDate: "2024-12-14T11:30:00Z",
      packedBy: "Factory Worker 2",
      notes: "Regular order"
    },
    {
      id: "FO-2024-004",
      originalOrderId: "ORD-2024-004",
      factoryId: 1,
      branchId: 3,
      branchName: "South Branch",
      branchCode: "BF1-SOUTH",
      franchiseId: 5,
      franchiseName: "Franchise Owner D",
      franchiseLocation: "Mumbai Branch",
      products: [
        { id: 1, name: "Karachi Famous Fruit Biscuits", quantity: 15, price: 450, category: "Biscuits" },
        { id: 6, name: "Coconut Cookies", quantity: 8, price: 350, category: "Biscuits" }
      ],
      totalAmount: 9550,
      orderDate: "2024-12-14T16:45:00Z",
      status: "packed",
      priority: "medium",
      packedDate: "2024-12-15T08:20:00Z",
      packedBy: "Factory Worker 3",
      notes: "Bulk order for corporate client"
    },
    {
      id: "FO-2024-005",
      originalOrderId: "ORD-2024-005",
      factoryId: 1,
      branchId: 1,
      branchName: "Main Branch",
      branchCode: "BF1-MAIN",
      franchiseId: 2,
      franchiseName: "Franchise Owner A",
      franchiseLocation: "Hyderabad Branch",
      products: [
        { id: 7, name: "Kaju & Badam Biscuit", quantity: 6, price: 520, category: "Biscuits" },
        { id: 8, name: "Badam Pista Biscuit", quantity: 4, price: 480, category: "Biscuits" }
      ],
      totalAmount: 5040,
      orderDate: "2024-12-13T11:30:00Z",
      status: "delivered",
      priority: "high",
      packedDate: "2024-12-13T14:15:00Z",
      packedBy: "Factory Worker 1",
      notes: "Premium biscuits for special occasion"
    },

    // Week 2
    {
      id: "FO-2024-006",
      originalOrderId: "ORD-2024-006",
      factoryId: 1,
      branchId: 2,
      branchName: "North Branch",
      branchCode: "BF1-NORTH",
      franchiseId: 4,
      franchiseName: "Franchise Owner C",
      franchiseLocation: "Delhi Branch",
      products: [
        { id: 9, name: "Kesar Pista Biscuit", quantity: 10, price: 380, category: "Biscuits" },
        { id: 10, name: "Dum Ke Rote Biscuit", quantity: 7, price: 420, category: "Biscuits" }
      ],
      totalAmount: 6740,
      orderDate: "2024-12-12T13:45:00Z",
      status: "delivered",
      priority: "medium",
      packedDate: "2024-12-12T16:20:00Z",
      packedBy: "Factory Worker 2",
      notes: "Festival season order"
    },
    {
      id: "FO-2024-007",
      originalOrderId: "ORD-2024-007",
      factoryId: 1,
      branchId: 1,
      branchName: "Main Branch",
      branchCode: "BF1-MAIN",
      franchiseId: 2,
      franchiseName: "Franchise Owner A",
      franchiseLocation: "Hyderabad Branch",
      products: [
        { id: 1, name: "Karachi Famous Fruit Biscuits", quantity: 20, price: 450, category: "Biscuits" }
      ],
      totalAmount: 9000,
      orderDate: "2024-12-11T08:30:00Z",
      status: "delivered",
      priority: "high",
      packedDate: "2024-12-11T10:45:00Z",
      packedBy: "Factory Worker 3",
      notes: "Large quantity for weekend sale"
    },
    {
      id: "FO-2024-008",
      originalOrderId: "ORD-2024-008",
      factoryId: 1,
      branchId: 3,
      branchName: "South Branch",
      branchCode: "BF1-SOUTH",
      franchiseId: 5,
      franchiseName: "Franchise Owner D",
      franchiseLocation: "Mumbai Branch",
      products: [
        { id: 2, name: "Cashew Biscuit Premium", quantity: 12, price: 380, category: "Biscuits" },
        { id: 3, name: "Osmania Biscuit", quantity: 15, price: 320, category: "Biscuits" }
      ],
      totalAmount: 8760,
      orderDate: "2024-12-10T15:20:00Z",
      status: "delivered",
      priority: "medium",
      packedDate: "2024-12-10T17:30:00Z",
      packedBy: "Factory Worker 1",
      notes: "Mixed variety order"
    },

    // Week 3
    {
      id: "FO-2024-009",
      originalOrderId: "ORD-2024-009",
      factoryId: 1,
      branchId: 1,
      branchName: "Main Branch",
      branchCode: "BF1-MAIN",
      franchiseId: 2,
      franchiseName: "Franchise Owner A",
      franchiseLocation: "Hyderabad Branch",
      products: [
        { id: 4, name: "Pista Biscuit", quantity: 8, price: 420, category: "Biscuits" },
        { id: 5, name: "Chand Biscuit", quantity: 10, price: 280, category: "Biscuits" }
      ],
      totalAmount: 6160,
      orderDate: "2024-12-09T12:15:00Z",
      status: "delivered",
      priority: "low",
      packedDate: "2024-12-09T14:20:00Z",
      packedBy: "Factory Worker 2",
      notes: "Regular weekly order"
    },
    {
      id: "FO-2024-010",
      originalOrderId: "ORD-2024-010",
      factoryId: 1,
      branchId: 2,
      branchName: "North Branch",
      branchCode: "BF1-NORTH",
      franchiseId: 4,
      franchiseName: "Franchise Owner C",
      franchiseLocation: "Delhi Branch",
      products: [
        { id: 6, name: "Coconut Cookies", quantity: 6, price: 350, category: "Biscuits" },
        { id: 7, name: "Kaju & Badam Biscuit", quantity: 5, price: 520, category: "Biscuits" }
      ],
      totalAmount: 5300,
      orderDate: "2024-12-08T10:45:00Z",
      status: "delivered",
      priority: "medium",
      packedDate: "2024-12-08T13:10:00Z",
      packedBy: "Factory Worker 3",
      notes: "Premium customer order"
    },

    // Week 4 - Older orders
    {
      id: "FO-2024-011",
      originalOrderId: "ORD-2024-011",
      factoryId: 1,
      branchId: 1,
      branchName: "Main Branch",
      branchCode: "BF1-MAIN",
      franchiseId: 2,
      franchiseName: "Franchise Owner A",
      franchiseLocation: "Hyderabad Branch",
      products: [
        { id: 1, name: "Karachi Famous Fruit Biscuits", quantity: 25, price: 450, category: "Biscuits" }
      ],
      totalAmount: 11250,
      orderDate: "2024-12-07T09:30:00Z",
      status: "delivered",
      priority: "high",
      packedDate: "2024-12-07T11:45:00Z",
      packedBy: "Factory Worker 1",
      notes: "Bulk order for corporate event"
    },
    {
      id: "FO-2024-012",
      originalOrderId: "ORD-2024-012",
      factoryId: 1,
      branchId: 3,
      branchName: "South Branch",
      branchCode: "BF1-SOUTH",
      franchiseId: 5,
      franchiseName: "Franchise Owner D",
      franchiseLocation: "Mumbai Branch",
      products: [
        { id: 8, name: "Badam Pista Biscuit", quantity: 8, price: 480, category: "Biscuits" },
        { id: 9, name: "Kesar Pista Biscuit", quantity: 6, price: 380, category: "Biscuits" }
      ],
      totalAmount: 6120,
      orderDate: "2024-12-06T14:20:00Z",
      status: "delivered",
      priority: "medium",
      packedDate: "2024-12-06T16:30:00Z",
      packedBy: "Factory Worker 2",
      notes: "Festival preparation order"
    },
    {
      id: "FO-2024-013",
      originalOrderId: "ORD-2024-013",
      factoryId: 1,
      branchId: 2,
      branchName: "North Branch",
      branchCode: "BF1-NORTH",
      franchiseId: 4,
      franchiseName: "Franchise Owner C",
      franchiseLocation: "Delhi Branch",
      products: [
        { id: 10, name: "Dum Ke Rote Biscuit", quantity: 12, price: 420, category: "Biscuits" }
      ],
      totalAmount: 5040,
      orderDate: "2024-12-05T11:15:00Z",
      status: "delivered",
      priority: "low",
      packedDate: "2024-12-05T13:20:00Z",
      packedBy: "Factory Worker 3",
      notes: "Regular order"
    },

    // More orders for comprehensive data
    {
      id: "FO-2024-014",
      originalOrderId: "ORD-2024-014",
      factoryId: 1,
      branchId: 1,
      branchName: "Main Branch",
      branchCode: "BF1-MAIN",
      franchiseId: 2,
      franchiseName: "Franchise Owner A",
      franchiseLocation: "Hyderabad Branch",
      products: [
        { id: 2, name: "Cashew Biscuit Premium", quantity: 15, price: 380, category: "Biscuits" },
        { id: 3, name: "Osmania Biscuit", quantity: 10, price: 320, category: "Biscuits" }
      ],
      totalAmount: 8900,
      orderDate: "2024-12-04T16:30:00Z",
      status: "delivered",
      priority: "high",
      packedDate: "2024-12-04T18:45:00Z",
      packedBy: "Factory Worker 1",
      notes: "Weekend rush order"
    },
    {
      id: "FO-2024-015",
      originalOrderId: "ORD-2024-015",
      factoryId: 1,
      branchId: 3,
      branchName: "South Branch",
      branchCode: "BF1-SOUTH",
      franchiseId: 5,
      franchiseName: "Franchise Owner D",
      franchiseLocation: "Mumbai Branch",
      products: [
        { id: 4, name: "Pista Biscuit", quantity: 7, price: 420, category: "Biscuits" },
        { id: 5, name: "Chand Biscuit", quantity: 9, price: 280, category: "Biscuits" }
      ],
      totalAmount: 5460,
      orderDate: "2024-12-03T13:45:00Z",
      status: "delivered",
      priority: "medium",
      packedDate: "2024-12-03T15:30:00Z",
      packedBy: "Factory Worker 2",
      notes: "Mixed variety order"
    },

    // Additional orders for better analytics
    {
      id: "FO-2024-016",
      originalOrderId: "ORD-2024-016",
      factoryId: 1,
      branchId: 2,
      branchName: "North Branch",
      branchCode: "BF1-NORTH",
      franchiseId: 4,
      franchiseName: "Franchise Owner C",
      franchiseLocation: "Delhi Branch",
      products: [
        { id: 1, name: "Karachi Famous Fruit Biscuits", quantity: 18, price: 450, category: "Biscuits" }
      ],
      totalAmount: 8100,
      orderDate: "2024-12-02T10:20:00Z",
      status: "delivered",
      priority: "high",
      packedDate: "2024-12-02T12:15:00Z",
      packedBy: "Factory Worker 3",
      notes: "Large quantity order"
    },
    {
      id: "FO-2024-017",
      originalOrderId: "ORD-2024-017",
      factoryId: 1,
      branchId: 1,
      branchName: "Main Branch",
      branchCode: "BF1-MAIN",
      franchiseId: 2,
      franchiseName: "Franchise Owner A",
      franchiseLocation: "Hyderabad Branch",
      products: [
        { id: 6, name: "Coconut Cookies", quantity: 5, price: 350, category: "Biscuits" },
        { id: 7, name: "Kaju & Badam Biscuit", quantity: 4, price: 520, category: "Biscuits" }
      ],
      totalAmount: 3830,
      orderDate: "2024-12-01T15:10:00Z",
      status: "delivered",
      priority: "low",
      packedDate: "2024-12-01T17:20:00Z",
      packedBy: "Factory Worker 1",
      notes: "Small premium order"
    }
  ],

  // Factory Products with Stock Information
  factoryProducts: [
    { id: 1, name: "Karachi Famous Fruit Biscuits", stock: 150, minStock: 50, maxStock: 500, status: "in_stock", image: "/src/assets/biscuits-collection.jpg", price: 450 },
    { id: 2, name: "Cashew Biscuit Premium", stock: 80, minStock: 30, maxStock: 300, status: "in_stock", image: "/src/assets/biscuits-collection.jpg", price: 380 },
    { id: 3, name: "Osmania Biscuit", stock: 200, minStock: 100, maxStock: 600, status: "in_stock", image: "/src/assets/biscuits-collection.jpg", price: 320 },
    { id: 4, name: "Pista Biscuit", stock: 45, minStock: 20, maxStock: 200, status: "low_stock", image: "/src/assets/biscuits-collection.jpg", price: 420 },
    { id: 5, name: "Chand Biscuit", stock: 120, minStock: 50, maxStock: 400, status: "in_stock", image: "/src/assets/biscuits-collection.jpg", price: 280 },
    { id: 6, name: "Coconut Cookies", stock: 0, minStock: 25, maxStock: 150, status: "out_of_stock", image: "/src/assets/biscuits-collection.jpg", price: 350 },
    { id: 7, name: "Kaju & Badam Biscuit", stock: 60, minStock: 20, maxStock: 250, status: "in_stock", image: "/src/assets/biscuits-collection.jpg", price: 520 },
    { id: 8, name: "Badam Pista Biscuit", stock: 35, minStock: 15, maxStock: 180, status: "low_stock", image: "/src/assets/biscuits-collection.jpg", price: 480 },
    { id: 9, name: "Kesar Pista Biscuit", stock: 90, minStock: 30, maxStock: 300, status: "in_stock", image: "/src/assets/biscuits-collection.jpg", price: 380 },
    { id: 10, name: "Dum Ke Rote Biscuit", stock: 110, minStock: 40, maxStock: 350, status: "in_stock", image: "/src/assets/biscuits-collection.jpg", price: 420 }
  ],

  // Analytics Data for Past Month
  analytics: {
    // Daily analytics for the past 30 days
    dailyStats: [
      { date: "2024-12-15", orders: 2, revenue: 12080, productsSold: 46 },
      { date: "2024-12-14", orders: 2, revenue: 12910, productsSold: 35 },
      { date: "2024-12-13", orders: 1, revenue: 5040, productsSold: 10 },
      { date: "2024-12-12", orders: 1, revenue: 6740, productsSold: 17 },
      { date: "2024-12-11", orders: 1, revenue: 9000, productsSold: 20 },
      { date: "2024-12-10", orders: 1, revenue: 8760, productsSold: 27 },
      { date: "2024-12-09", orders: 1, revenue: 6160, productsSold: 18 },
      { date: "2024-12-08", orders: 1, revenue: 5300, productsSold: 11 },
      { date: "2024-12-07", orders: 1, revenue: 11250, productsSold: 25 },
      { date: "2024-12-06", orders: 1, revenue: 6120, productsSold: 14 },
      { date: "2024-12-05", orders: 1, revenue: 5040, productsSold: 12 },
      { date: "2024-12-04", orders: 1, revenue: 8900, productsSold: 25 },
      { date: "2024-12-03", orders: 1, revenue: 5460, productsSold: 16 },
      { date: "2024-12-02", orders: 1, revenue: 8100, productsSold: 18 },
      { date: "2024-12-01", orders: 1, revenue: 3830, productsSold: 9 },
      { date: "2024-11-30", orders: 2, revenue: 15800, productsSold: 42 },
      { date: "2024-11-29", orders: 1, revenue: 7200, productsSold: 20 },
      { date: "2024-11-28", orders: 2, revenue: 13400, productsSold: 38 },
      { date: "2024-11-27", orders: 1, revenue: 6800, productsSold: 18 },
      { date: "2024-11-26", orders: 1, revenue: 9200, productsSold: 25 },
      { date: "2024-11-25", orders: 2, revenue: 14500, productsSold: 40 },
      { date: "2024-11-24", orders: 1, revenue: 5600, productsSold: 15 },
      { date: "2024-11-23", orders: 1, revenue: 7800, productsSold: 22 },
      { date: "2024-11-22", orders: 2, revenue: 16200, productsSold: 45 },
      { date: "2024-11-21", orders: 1, revenue: 6400, productsSold: 18 },
      { date: "2024-11-20", orders: 1, revenue: 8800, productsSold: 24 },
      { date: "2024-11-19", orders: 2, revenue: 15600, productsSold: 42 },
      { date: "2024-11-18", orders: 1, revenue: 7200, productsSold: 20 },
      { date: "2024-11-17", orders: 1, revenue: 9600, productsSold: 26 },
      { date: "2024-11-16", orders: 2, revenue: 16800, productsSold: 48 }
    ],

    // Summary statistics
    summary: {
      totalOrders: 30,
      totalRevenue: 350000,
      totalProductsSold: 850,
      averageOrderValue: 11667,
      topSellingProduct: "Karachi Famous Fruit Biscuits",
      mostActiveBranch: "Main Branch",
      averageDailyOrders: 1.0,
      averageDailyRevenue: 11667
    },

    // Branch-wise performance
    branchPerformance: [
      {
        branchId: 1,
        branchName: "Main Branch",
        branchCode: "BF1-MAIN",
        orders: 12,
        revenue: 145000,
        productsSold: 350
      },
      {
        branchId: 2,
        branchName: "North Branch",
        branchCode: "BF1-NORTH",
        orders: 9,
        revenue: 98000,
        productsSold: 240
      },
      {
        branchId: 3,
        branchName: "South Branch",
        branchCode: "BF1-SOUTH",
        orders: 9,
        revenue: 107000,
        productsSold: 260
      }
    ],

    // Product performance
    productPerformance: [
      { productId: 1, name: "Karachi Famous Fruit Biscuits", sold: 180, revenue: 81000 },
      { productId: 2, name: "Cashew Biscuit Premium", sold: 95, revenue: 36100 },
      { productId: 3, name: "Osmania Biscuit", sold: 120, revenue: 38400 },
      { productId: 4, name: "Pista Biscuit", sold: 85, revenue: 35700 },
      { productId: 5, name: "Chand Biscuit", sold: 110, revenue: 30800 },
      { productId: 6, name: "Coconut Cookies", sold: 75, revenue: 26250 },
      { productId: 7, name: "Kaju & Badam Biscuit", sold: 65, revenue: 33800 },
      { productId: 8, name: "Badam Pista Biscuit", sold: 55, revenue: 26400 },
      { productId: 9, name: "Kesar Pista Biscuit", sold: 70, revenue: 26600 },
      { productId: 10, name: "Dum Ke Rote Biscuit", sold: 80, revenue: 33600 }
    ]
  }
};

// Utility functions for data manipulation
export const getFactoryOrdersByStatus = (status) => {
  return factoryDashboardData.factoryOrders.filter(order => order.status === status);
};

export const getFactoryOrdersByBranch = (branchId) => {
  return factoryDashboardData.factoryOrders.filter(order => order.branchId === branchId);
};

export const getFactoryOrdersByDateRange = (startDate, endDate) => {
  return factoryDashboardData.factoryOrders.filter(order => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
  });
};

export const getTodayOrders = () => {
  const today = new Date().toISOString().split('T')[0];
  return getFactoryOrdersByDateRange(today, today);
};

export const getYesterdayOrders = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  return getFactoryOrdersByDateRange(yesterdayStr, yesterdayStr);
};

export const getLowStockProducts = () => {
  return factoryDashboardData.factoryProducts.filter(product => 
    product.status === 'low_stock' || product.status === 'out_of_stock'
  );
};

export const getAnalyticsByPeriod = (period) => {
  const { dailyStats } = factoryDashboardData.analytics;
  const now = new Date();
  
  switch (period) {
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return dailyStats.filter(stat => new Date(stat.date) >= weekAgo);
    case 'month':
      return dailyStats;
    case 'quarter':
      const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return dailyStats.filter(stat => new Date(stat.date) >= quarterAgo);
    default:
      return dailyStats;
  }
};
