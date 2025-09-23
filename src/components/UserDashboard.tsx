import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { getCurrentUser } from '../utils/auth';
import { fakeProducts } from '../data/products';
import { fakeOrders, generateOrderId } from '../data/orders';
import { sendOrderNotification } from '../utils/emailService';
import { getFactoryForCategory, getFactoriesForCategory } from '../data/factories';
import { generateFactoryOrderId } from '../data/factoryOrders';
import { 
  ShoppingCart, 
  Package, 
  Minus, 
  Plus, 
  Trash2,
  Send,
  History,
  User,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Heart,
  ChevronRight,
  X,
  Eye
} from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products] = useState(fakeProducts.filter(p => p.stock > 0));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState(fakeOrders.filter(order => order.userId === getCurrentUser()?.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showCart, setShowCart] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showBiscuitFactoryModal, setShowBiscuitFactoryModal] = useState(false);
  const [pendingBiscuitProduct, setPendingBiscuitProduct] = useState<{id: number; name: string; price: number; category: string; image: string} | null>(null);
  const [biscuitFactorySelections, setBiscuitFactorySelections] = useState<Record<number, number>>({});
  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const { toast } = useToast();
  const user = getCurrentUser();

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.sold - a.sold; // Using sold as proxy for rating
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCart = (product: {id: number; name: string; price: number; category: string; image: string}) => {
    // Check if it's a biscuit product and no factory is selected for this specific product
    if (product.category === 'Biscuits' && !biscuitFactorySelections[product.id]) {
      setPendingBiscuitProduct(product);
      setShowBiscuitFactoryModal(true);
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getCartItemQuantity = (productId: number) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Group cart items by category
  const getCartItemsByCategory = () => {
    const grouped = cart.reduce((acc, item) => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        const category = product.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push({ ...item, category });
      }
      return acc;
    }, {} as Record<string, {id: number; name: string; price: number; category: string; quantity: number; image: string}[]>);

    return grouped;
  };

  // Handle biscuit factory selection
  const handleBiscuitFactorySelection = (factoryId: number) => {
    if (pendingBiscuitProduct) {
      // Store factory selection for this specific product
      setBiscuitFactorySelections(prev => ({
        ...prev,
        [pendingBiscuitProduct.id]: factoryId
      }));
      
      // Add the product to cart
      const existingItem = cart.find(item => item.id === pendingBiscuitProduct.id);
      
      if (existingItem) {
        setCart(cart.map(item => 
          item.id === pendingBiscuitProduct.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        setCart([...cart, {
          id: pendingBiscuitProduct.id,
          name: pendingBiscuitProduct.name,
          price: pendingBiscuitProduct.price,
          quantity: 1,
          image: pendingBiscuitProduct.image
        }]);
      }
      
      const selectedFactory = getBiscuitFactories().find(f => f.id === factoryId);
      toast({
        title: "Added to Cart",
        description: `${pendingBiscuitProduct.name} has been added to cart and will be routed to ${selectedFactory?.name}.`,
      });
    }
    
    setShowBiscuitFactoryModal(false);
    setPendingBiscuitProduct(null);
  };

  // Get biscuit factories
  const getBiscuitFactories = () => {
    return getFactoriesForCategory('Biscuits');
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== id));
      
      // Clear factory selection if it's a biscuit product
      const product = products.find(p => p.id === id);
      if (product?.category === 'Biscuits') {
        setBiscuitFactorySelections(prev => {
          const newSelections = { ...prev };
          delete newSelections[id];
          return newSelections;
        });
      }
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
    
    // Clear factory selection if it's a biscuit product
    const product = products.find(p => p.id === id);
    if (product?.category === 'Biscuits') {
      setBiscuitFactorySelections(prev => {
        const newSelections = { ...prev };
        delete newSelections[id];
        return newSelections;
      });
    }
    
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    const orderId = generateOrderId();
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Group cart items by category for factory routing
    const ordersByCategory = cart.reduce((acc, item) => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        const category = product.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
      }
      return acc;
    }, {});

    // Create factory orders for each category
    const factoryOrders = [];
    Object.entries(ordersByCategory).forEach(([category, items]) => {
      if (category === 'Biscuits') {
        // For biscuits, group by selected factory
        const itemsByFactory = (items as {id: number; name: string; price: number; category: string; quantity: number; image: string}[]).reduce((acc, item) => {
          const factoryId = biscuitFactorySelections[item.id];
          if (factoryId) {
            if (!acc[factoryId]) {
              acc[factoryId] = [];
            }
            acc[factoryId].push(item);
          }
          return acc;
        }, {} as Record<number, {id: number; name: string; price: number; category: string; quantity: number; image: string}[]>);

        // Create separate orders for each factory
        Object.entries(itemsByFactory).forEach(([factoryId, factoryItems]) => {
          const factory = getBiscuitFactories().find(f => f.id === parseInt(factoryId));
          if (factory) {
            const factoryOrderId = generateFactoryOrderId();
            const categoryTotal = (factoryItems as {id: number; name: string; price: number; category: string; quantity: number; image: string}[]).reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            factoryOrders.push({
              id: factoryOrderId,
              originalOrderId: orderId,
              factoryId: factory.id,
              factoryName: factory.name,
              factoryType: factory.type,
              branchId: 1, // Default branch - in real app, this would be based on user location
              branchName: factory.branches[0].name,
              branchCode: factory.branches[0].code,
              franchiseId: user?.id,
              franchiseName: user?.name,
              franchiseLocation: user?.location || 'Unknown Location',
              products: (factoryItems as {id: number; name: string; price: number; category: string; quantity: number; image: string}[]).map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                category: category
              })),
              totalAmount: categoryTotal,
              orderDate: currentDate,
              status: 'pending',
              packedDate: null,
              packedBy: null,
              notes: `Order from ${user?.name} - ${user?.location}`
            });
          }
        });
      } else {
        // For other categories, use default routing
        const factory = getFactoryForCategory(category);
        if (factory) {
          const factoryOrderId = generateFactoryOrderId();
          const categoryTotal = (items as {id: number; name: string; price: number; category: string; quantity: number; image: string}[]).reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          factoryOrders.push({
            id: factoryOrderId,
            originalOrderId: orderId,
            factoryId: factory.id,
            factoryName: factory.name,
            factoryType: factory.type,
            branchId: 1, // Default branch - in real app, this would be based on user location
            branchName: factory.branches[0].name,
            branchCode: factory.branches[0].code,
            franchiseId: user?.id,
            franchiseName: user?.name,
            franchiseLocation: user?.location || 'Unknown Location',
            products: (items as {id: number; name: string; price: number; category: string; quantity: number; image: string}[]).map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              category: category
            })),
            totalAmount: categoryTotal,
            orderDate: currentDate,
            status: 'pending',
            packedDate: null,
            packedBy: null,
            notes: `Order from ${user?.name} - ${user?.location}`
          });
        }
      }
    });
    
    // Create new order for user's order history
    const newOrder = {
      id: orderId,
      userId: user?.id,
      productName: cart.map(item => `${item.name} (x${item.quantity})`).join(', '),
      quantity: cart.reduce((total, item) => total + item.quantity, 0),
      total: getTotalAmount(),
      status: 'pending' as const,
      orderDate: currentDate,
      franchiseLocation: user?.location || 'Unknown Location'
    };
    
    // Create order data for email
    const orderData = {
      productName: newOrder.productName,
      quantity: newOrder.quantity,
      total: newOrder.total,
      franchiseLocation: newOrder.franchiseLocation,
      customerName: user?.name || 'Unknown Customer'
    };

    try {
      // Send order notification email to relevant factories
      await sendOrderNotification(orderData);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${orderId} for ₹${getTotalAmount()} has been placed and routed to ${factoryOrders.length} factory(ies) based on product categories.`,
      });
    } catch (emailError) {
      console.error('Failed to send order notification:', emailError);
      
      toast({
        title: "Order Placed",
        description: `Order #${orderId} for ₹${getTotalAmount()} has been placed and routed to ${factoryOrders.length} factory(ies), but email notification failed.`,
      });
    }

    // Add new order to user's order history
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    
    // Clear cart after placing order
    setCart([]);
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                  <Package className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Karachi Bakery</h1>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{user?.location}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowOrderHistory(true)}
                className="hidden sm:flex items-center gap-2"
                size="sm"
              >
                <History className="h-4 w-4" />
                <span>Order History</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowCart(true)}
                className="relative"
                size="sm"
              >
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Search and Filters */}
        <div className="mb-3 sm:mb-6 space-y-2 sm:space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 h-9 sm:h-12 text-sm sm:text-lg"
            />
          </div>

          {/* Category Filter - Simplified for mobile */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-2">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground min-w-fit">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Categories:</span>
            </div>
            <div className="flex gap-1 sm:gap-2 min-w-max">
              {categories.map((category) => (
                <Button
                  key={category as string}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category as string)}
                  className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                >
                  {category === 'all' ? 'All' : category as string}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Options - Hidden on mobile to save space */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border rounded-md bg-background text-xs sm:text-sm"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-2xl font-bold text-foreground">
                {selectedCategory === 'all' ? 'All Products' : selectedCategory}
                <span className="text-xs sm:text-lg font-normal text-muted-foreground ml-1 sm:ml-2">
                  ({filteredProducts.length})
                </span>
              </h2>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
              {filteredProducts.map((product) => {
                const cartQuantity = getCartItemQuantity(product.id);
                const isFavorite = favorites.includes(product.id);
                
                return (
                  <Card key={product.id} className="group shadow-soft hover:shadow-warm transition-all duration-300 border-0 bg-white">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative">
                        <div className="aspect-square bg-secondary rounded-t-lg overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        
                        {/* Favorite Button - Hidden on mobile */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white/80 hover:bg-white rounded-full hidden sm:flex"
                          onClick={() => toggleFavorite(product.id)}
                        >
                          <Heart 
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                          />
                        </Button>

                        {/* Stock Badge - Ultra-compact for 4-column mobile */}
                        <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                          <Badge 
                            variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                            className="text-xs px-1 py-0 sm:px-2 sm:py-1 h-4 sm:h-auto"
                          >
                            <span className="hidden sm:inline">{product.stock > 0 ? `${product.stock} left` : 'Out of stock'}</span>
                            <span className="sm:hidden text-xs">{product.stock > 0 ? product.stock : '0'}</span>
                          </Badge>
                        </div>
                      </div>

                      {/* Product Info - Ultra-compact for 4-column mobile */}
                      <div className="p-1 sm:p-4">
                        <div className="flex items-start justify-between mb-1 sm:mb-2">
                          <h3 className="font-semibold text-foreground text-xs sm:text-sm leading-tight line-clamp-2">
                            {product.name}
                          </h3>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2 hidden sm:block">
                          {product.description}
                        </p>

                        {/* Rating and Popularity - Hidden on mobile */}
                        <div className="flex items-center gap-2 mb-2 sm:mb-3 hidden sm:flex">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">4.5</span>
                          </div>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{product.sold} sold</span>
                        </div>

                        {/* Price and Add to Cart - Ultra-compact for mobile */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                          <div>
                            <span className="text-xs sm:text-lg font-bold text-primary">₹{product.price}</span>
                          </div>
                          
                          {cartQuantity > 0 ? (
                            <div className="flex items-center justify-center gap-1 sm:gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-5 w-5 sm:h-8 sm:w-8 p-0"
                                onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                              >
                                <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                              <span className="font-medium text-xs sm:text-sm min-w-[0.8rem] sm:min-w-[1.5rem] text-center">
                                {cartQuantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-5 w-5 sm:h-8 sm:w-8 p-0"
                                onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                              >
                                <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addToCart(product)}
                              className="bg-gradient-pink hover:bg-gradient-pink/90 text-white px-1 py-1 sm:px-4 sm:py-2 h-5 sm:h-8 text-xs sm:text-sm w-full sm:w-auto"
                            >
                              <Plus className="h-2 w-2 sm:h-3 sm:w-3 sm:mr-1" />
                              <span className="hidden sm:inline">Add</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Order History</h2>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start ordering products to see your order history here
                </p>
                <Button
                  onClick={() => setActiveTab('products')}
                  className="bg-gradient-pink"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="shadow-soft hover:shadow-warm transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">Order #{order.id}</h3>
                            <Badge variant={
                              order.status === 'completed' ? 'default' : 
                              order.status === 'shipped' ? 'secondary' : 
                              order.status === 'pending' ? 'outline' : 'secondary'
                            }>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{order.productName}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{order.orderDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{order.franchiseLocation}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">₹{order.total}</p>
                          <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Your Cart</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCart(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <Button 
                      onClick={() => {
                        setShowCart(false);
                        setActiveTab('products');
                      }}
                      className="mt-4"
                      variant="outline"
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(getCartItemsByCategory()).map(([category, items]) => (
                      <div key={category} className="space-y-3">
                        {/* Category Header */}
                        <div className="flex items-center gap-2 pb-2 border-b">
                          <Package className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold text-sm text-foreground">{category}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {items.length} item{items.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        
                        {/* Category Items */}
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-secondary/20">
                            <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                    {item.category === 'Biscuits' && biscuitFactorySelections[item.id] && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getBiscuitFactories().find(f => f.id === biscuitFactorySelections[item.id])?.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium text-sm min-w-[1.5rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 w-6 p-0"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="text-right min-w-[3rem]">
                              <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
                            </div>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-primary">₹{getTotalAmount()}</span>
                  </div>
                  
                  <Button 
                    onClick={() => setShowOrderSummaryModal(true)}
                    className="w-full bg-gradient-pink h-12 text-lg"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Proceed to Order
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Biscuit Factory Selection Modal */}
      {showBiscuitFactoryModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBiscuitFactoryModal(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">Choose Biscuit Factory</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBiscuitFactoryModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {pendingBiscuitProduct && (
                  <div className="bg-secondary/20 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={pendingBiscuitProduct.image} 
                          alt={pendingBiscuitProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{pendingBiscuitProduct.name}</h3>
                        <p className="text-xs text-muted-foreground">₹{pendingBiscuitProduct.price}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground mb-6">
                  Please select which biscuit factory you want to order this product from:
                </p>
                
                <div className="space-y-3">
                  {getBiscuitFactories().map((factory) => (
                    <Button
                      key={factory.id}
                      variant="outline"
                      className="w-full justify-start p-4 h-auto"
                      onClick={() => handleBiscuitFactorySelection(factory.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{factory.name}</div>
                          <div className="text-xs text-muted-foreground">{factory.location}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary Modal */}
      {showOrderSummaryModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowOrderSummaryModal(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Order Summary</h2>
                    <p className="text-sm text-muted-foreground">Review your order before placing</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOrderSummaryModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Customer Info */}
                <div className="bg-secondary/20 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-sm mb-2">Customer Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-medium">{user?.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2 font-medium">{user?.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Order Date:</span>
                      <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Order Time:</span>
                      <span className="ml-2 font-medium">{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items by Category */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-lg">Order Items</h3>
                  {Object.entries(getCartItemsByCategory()).map(([category, items]) => {
                    const categoryTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    return (
                      <div key={category} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Package className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold text-sm">{category}</h4>
                          <Badge variant="outline" className="text-xs">
                            {items.length} item{items.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-secondary rounded overflow-hidden flex-shrink-0">
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  {item.category === 'Biscuits' && biscuitFactorySelections[item.id] && (
                                    <div className="mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {getBiscuitFactories().find(f => f.id === biscuitFactorySelections[item.id])?.name}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">₹{item.price} × {item.quantity}</div>
                                <div className="text-primary font-bold">₹{item.price * item.quantity}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                          <span className="font-semibold text-sm">{category} Subtotal:</span>
                          <span className="font-bold text-primary">₹{categoryTotal}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total Summary */}
                <div className="bg-primary/5 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-primary text-xl">₹{getTotalAmount()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Order will be routed to {Object.keys(getCartItemsByCategory()).length} different factory(ies) based on product categories.
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowOrderSummaryModal(false)}
                    className="flex-1"
                  >
                    Back to Cart
                  </Button>
                  <Button 
                    onClick={() => {
                      placeOrder();
                      setShowOrderSummaryModal(false);
                      setShowCart(false);
                    }}
                    className="flex-1 bg-gradient-pink"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowOrderHistory(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Franchise Order History</h2>
                    <p className="text-sm text-muted-foreground">Complete order history for {user?.name} - {user?.location}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOrderHistory(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Franchise Info */}
                <div className="bg-secondary/20 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-sm mb-2">Franchise Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Franchise Name:</span>
                      <span className="ml-2 font-medium">{user?.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2 font-medium">{user?.location}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Orders:</span>
                      <span className="ml-2 font-medium">{orders.length}</span>
                    </div>
                  </div>
                </div>

                {/* Order Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">
                      {orders.reduce((sum, order) => sum + order.totalAmount, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Revenue (₹)</div>
                  </div>
                  <div className="bg-secondary/20 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {orders.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {orders.length > 0 ? Math.round(orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length) : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Order Value (₹)</div>
                  </div>
                </div>

                {/* Order History */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Order History</h3>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  Order #{order.id}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {order.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(order.orderDate).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Items:</span>
                                  <span className="ml-2 font-medium">{order.products.length} products</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Total:</span>
                                  <span className="ml-2 font-bold text-primary">₹{order.totalAmount}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // You can add a detailed view modal here
                                  toast({
                                    title: "Order Details",
                                    description: `Order #${order.id} - ${order.products.length} items - ₹${order.totalAmount}`,
                                  });
                                }}
                              >
                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="hidden sm:inline">View Details</span>
                              </Button>
                            </div>
                          </div>
                          
                          {/* Products Preview */}
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex flex-wrap gap-2">
                              {order.products.slice(0, 3).map((product, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {product.name} (×{product.quantity})
                                </Badge>
                              ))}
                              {order.products.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{order.products.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-6 pt-4 border-t">
                  <Button 
                    onClick={() => setShowOrderHistory(false)}
                    className="bg-gradient-pink"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;