import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart,
  Send
} from "lucide-react";

const Footer = () => {
  const locations = [
    {
      area: "Banjara Hills",
      address: "Road No. 12, Banjara Hills, Hyderabad - 500034",
      phone: "+91 40 1234 5678",
      hours: "7:00 AM - 10:00 PM"
    },
    {
      area: "Hi-Tech City", 
      address: "HITEC City, Madhapur, Hyderabad - 500081",
      phone: "+91 40 9876 5432",
      hours: "7:00 AM - 10:00 PM"
    },
    {
      area: "Kondapur",
      address: "Kothaguda, Kondapur, Hyderabad - 500084", 
      phone: "+91 40 5555 7777",
      hours: "7:00 AM - 10:00 PM"
    }
  ];

  const quickLinks = [
    "About Us", "Our Story", "Careers", "Franchise", 
    "Bulk Orders", "Corporate Catering", "Gift Cards", "Privacy Policy"
  ];

  const productLinks = [
    "Biscuits & Cookies", "Celebration Cakes", "Wedding Cakes",
    "Artisan Breads", "Pastries", "Seasonal Specials", "Gift Hampers", "Custom Orders"
  ];

  return (
    <footer className="bg-bakery-chocolate text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/20 text-primary-glow border-primary-glow/30">
              Stay Connected
            </Badge>
            <h3 className="text-3xl font-bold mb-4">
              Get Fresh Updates & Special Offers
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Be the first to know about new products, seasonal specials, and exclusive deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button 
                className="bg-primary hover:bg-primary-glow"
                onClick={() => {
                  alert('Thank you for subscribing! You will receive updates about new products and special offers.');
                }}
              >
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-pink bg-clip-text text-transparent">
              Karachi Bakery
            </h2>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Six decades of baking excellence, creating memories one bite at a time. 
              From traditional recipes to modern innovations, we're your neighborhood bakery with a legacy.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="ghost"
                  className="w-10 h-10 p-0 hover:bg-primary/20 hover:text-primary-glow transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-primary-foreground/70 hover:text-primary-glow transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Products</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-primary-foreground/70 hover:text-primary-glow transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Locations</h3>
            <div className="space-y-6">
              {locations.slice(0, 1).map((location) => (
                <div key={location.area} className="space-y-2">
                  <h4 className="font-medium text-primary-glow">{location.area}</h4>
                  <div className="space-y-2 text-sm text-primary-foreground/70">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{location.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{location.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{location.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                className="bg-primary hover:bg-primary-glow"
                onClick={() => {
                  alert('All 25 locations across India. Visit our website for complete list with addresses and contact details.');
                }}
              >
                View All Locations
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-primary-foreground/20" />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70">
            <span>© 2025 Karachi Bakery. All rights reserved KD DEVELOPERS.</span>
            <span className="hidden md:inline">•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-bakery-berry fill-current" /> in Hyderabad
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-primary-foreground/70 hover:text-primary-glow transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/70 hover:text-primary-glow transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-primary-foreground/70 hover:text-primary-glow transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
