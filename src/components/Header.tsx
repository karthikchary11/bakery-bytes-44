import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingBag, Phone, MapPin, Home } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const productCategories = [
    {
      title: "Biscuits & Cookies",
      items: ["Karachi Famous Biscuits", "Chocolate Cookies", "Sugar-Free Options", "Assorted Gift Packs"]
    },
    {
      title: "Cakes & Pastries",
      items: ["Birthday Cakes", "Wedding Cakes", "Custom Designs", "Daily Fresh Pastries"]
    },
    {
      title: "Breads & Snacks",
      items: ["Artisan Breads", "Fresh Sandwiches", "Healthy Snacks", "Breakfast Items"]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 text-sm border-b border-border/50">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>+91 8179600342</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Hyderabad, India</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ShoppingBag className="h-4 w-4 mr-1" />
              Order Online
            </Button>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-pink bg-clip-text text-transparent">
              Karachi Bakery
            </h1>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>

              {productCategories.map((category) => (
                <NavigationMenuItem key={category.title}>
                  <NavigationMenuTrigger className="bg-background data-[state=open]:bg-accent">
                    {category.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="bg-popover border border-border shadow-warm z-50">
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {category.items.map((item) => (
                        <li key={item}>
                          <NavigationMenuLink asChild>
                            <a
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              href="#"
                            >
                              <div className="text-sm font-medium leading-none">{item}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                Fresh daily selections
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                  About Us
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/contact" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-border">
              <nav className="flex flex-col gap-4 mt-8">
                <a href="/" className="text-lg font-medium hover:text-primary transition-colors flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Home
                </a>
                
                {productCategories.map((category) => (
                  <div key={category.title} className="space-y-2">
                    <h3 className="text-lg font-medium text-primary">{category.title}</h3>
                    <div className="ml-4 space-y-2">
                      {category.items.map((item) => (
                        <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                
                <a href="/about" className="text-lg font-medium hover:text-primary transition-colors">About Us</a>
                <a href="/contact" className="text-lg font-medium hover:text-primary transition-colors">Contact</a>
                
                <Button className="mt-4 bg-gradient-warm text-primary-foreground shadow-glow">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Order Online
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Order Button */}
          <div className="hidden lg:flex items-center gap-2">
            <Button className="bg-gradient-warm text-primary-foreground shadow-glow hover:shadow-deep transition-all duration-300">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Order Online
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
