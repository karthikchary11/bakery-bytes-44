import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Heart } from "lucide-react";
import heroImage from "@/assets/hero-bakery.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-bakery-chocolate/80 via-bakery-chocolate/60 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center lg:text-left">
        <div className="max-w-2xl mx-auto lg:mx-0">
          {/* Badge */}
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
            <Star className="h-3 w-3 mr-1 fill-current" />
            6+ Decades of Excellence
          </Badge>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-primary-foreground">Freshly Baked</span>
            <br />
            <span className="bg-gradient-golden bg-clip-text text-transparent">
              With Love
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 leading-relaxed">
            Experience the finest artisanal baked goods, crafted with premium ingredients 
            and traditional recipes passed down through generations.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="bg-gradient-warm text-primary-foreground shadow-glow hover:shadow-deep transition-all duration-300 transform hover:scale-105"
            >
              Explore Our Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {/* Our Story Section - No hover effects */}
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary-foreground/30 text-primary-foreground backdrop-blur-sm [&:hover]:bg-primary-foreground/10 [&:hover]:border-primary-foreground/30 [&:hover]:text-primary-foreground"
            >
              <Heart className="mr-2 h-5 w-5" />
              Our Story
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 text-center lg:text-left">
            <div>
              <div className="text-3xl font-bold text-primary-glow">60+</div>
              <div className="text-primary-foreground/80 text-sm">Years of Heritage</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-glow">500+</div>
              <div className="text-primary-foreground/80 text-sm">Daily Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-glow">100k+</div>
              <div className="text-primary-foreground/80 text-sm">Happy Customers</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-10 animate-bounce delay-1000">
        <div className="w-3 h-3 bg-primary-glow rounded-full shadow-glow"></div>
      </div>
      <div className="absolute bottom-32 left-20 animate-bounce delay-2000">
        <div className="w-2 h-2 bg-accent rounded-full shadow-soft"></div>
      </div>
      <div className="absolute top-1/2 right-1/4 animate-bounce delay-3000">
        <div className="w-4 h-4 bg-bakery-berry rounded-full shadow-warm"></div>
      </div>
    </section>
  );
};

export default Hero;