import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useToast } from '../hooks/use-toast';
import { Plus, Eye, Edit, Trash2, Save, X } from 'lucide-react';

const ProductManagement = ({ products, setProducts }: { products: any[], setProducts: (products: any[]) => void }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: ''
  });
  const { toast } = useToast();

  const categories = ['Biscuits', 'Cakes', 'Breads', 'Pastries'];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.image || `/api/placeholder/300/200?text=${encodeURIComponent(newProduct.name)}`,
      sold: 0
    };

    setProducts([...products, product]);
    setNewProduct({ name: '', price: '', stock: '', category: '', description: '', image: '' });
    setIsAddModalOpen(false);
    
    toast({
      title: "Product Added",
      description: `${product.name} has been successfully added to the inventory.`,
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.stock || !editingProduct.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const updatedProducts = products.map(p => 
      p.id === editingProduct.id 
        ? { ...editingProduct, price: parseFloat(editingProduct.price), stock: parseInt(editingProduct.stock) }
        : p
    );
    
    setProducts(updatedProducts);
    setIsEditModalOpen(false);
    setEditingProduct(null);
    
    toast({
      title: "Product Updated",
      description: `${editingProduct.name} has been successfully updated.`,
    });
  };

  const handleDeleteProduct = (productId: number) => {
    const productName = products.find(p => p.id === productId)?.name;
    setProducts(products.filter(p => p.id !== productId));
    
    toast({
      title: "Product Deleted",
      description: `${productName} has been removed from the inventory.`,
    });
  };

  const openEditModal = (product: any) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const openViewModal = (product: any) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Management</CardTitle>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-pink">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock *</label>
                  <Input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter product description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="Enter image URL (optional)"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddProduct} className="flex-1 bg-gradient-pink">
                  <Save className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="shadow-soft">
              <CardContent className="p-4">
                <div className="aspect-square bg-secondary rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `/api/placeholder/300/200?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
                </div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-primary">₹{product.price}</span>
                  <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openViewModal(product)} title="View Details">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEditModal(product)} title="Edit Product">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-destructive hover:text-destructive"
                    title="Delete Product"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Stock *</label>
                  <Input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Enter product description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  placeholder="Enter image URL"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleEditProduct} className="flex-1 bg-gradient-pink">
                  <Save className="mr-2 h-4 w-4" />
                  Update Product
                </Button>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-4">
              <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
                <img 
                  src={viewingProduct.image} 
                  alt={viewingProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `/api/placeholder/300/200?text=${encodeURIComponent(viewingProduct.name)}`;
                  }}
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">{viewingProduct.name}</h3>
                  <Badge variant={viewingProduct.stock > 0 ? 'default' : 'destructive'} className="mt-1">
                    {viewingProduct.category}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Price</label>
                    <p className="text-lg font-bold text-primary">₹{viewingProduct.price}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Stock</label>
                    <p className="text-lg font-bold">{viewingProduct.stock} units</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                  <p className="text-sm">{viewingProduct.description || 'No description available'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Total Sold</label>
                  <p className="text-sm">{viewingProduct.sold || 0} units</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  setIsViewModalOpen(false);
                  openEditModal(viewingProduct);
                }} className="flex-1 bg-gradient-pink">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Product
                </Button>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductManagement;