import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import biscuitsImage from "@/assets/biscuits-collection.jpg";
import cakesImage from "@/assets/cakes-collection.jpg";
import breadsImage from "@/assets/breads-pastries.jpg";

const ProductCategories = () => {
  const categories = [
    {
      title: "Premium Biscuits & Cookies",
      description: "Handcrafted with the finest ingredients, our signature biscuits have been delighting families for generations.",
      image: biscuitsImage,
      badge: "Bestseller",
      items: ["Karachi Famous Biscuits", "Chocolate Chip Cookies", "Butter Cookies", "Festive Specials"],
      gradient: "from-primary/20 to-primary-glow/30"
    },
    {
      title: "Celebration Cakes",
      description: "From intimate gatherings to grand celebrations, our custom cakes make every moment memorable.",
      image: cakesImage,
      badge: "Custom Made",
      items: ["Birthday Cakes", "Wedding Cakes", "Anniversary Specials", "Designer Themes"],
      gradient: "from-accent/20 to-bakery-berry/30"
    },
    {
      title: "Artisan Breads & Pastries",
      description: "Fresh daily selections of artisanal breads, croissants, and pastries baked with traditional techniques.",
      image: breadsImage,
      badge: "Daily Fresh",
      items: ["Sourdough Loaves", "French Croissants", "Danish Pastries", "Whole Grain Options"],
      gradient: "from-bakery-crust/20 to-primary-deep/30"
    }
  ];

  return (
    <section className="py-20 bg-gradient-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Our Specialties
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Crafted with 
            <span className="bg-gradient-golden bg-clip-text text-transparent"> Passion</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every item in our collection represents decades of perfected recipes, 
            premium ingredients, and the artistry of traditional baking.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => (
            <Card 
              key={category.title} 
              className="group overflow-hidden border-0 shadow-warm hover:shadow-deep transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60`}></div>
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  {category.badge}
                </Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                {/* Items List */}
                <div className="space-y-2 mb-6">
                  {category.items.map((item) => (
                    <div key={item} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {item}
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Explore Collection
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-warm p-8 rounded-2xl shadow-glow">
            <h3 className="text-3xl font-bold text-primary-foreground mb-4">
              Can't Decide? Try Our Sampler Pack!
            </h3>
            <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
              Get a taste of all our specialties with our carefully curated sampler pack. 
              Perfect for gifting or discovering your new favorites.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-soft"
            >
              Order Sampler Pack
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;