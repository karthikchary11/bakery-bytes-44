import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Regular Customer",
      content: "Golden Bakery has been our family's go-to place for celebrations for over 20 years. Their cakes are not just delicious, they're works of art!",
      rating: 5,
      location: "Banjara Hills"
    },
    {
      name: "Raj Patel", 
      role: "Corporate Client",
      content: "We order their biscuit hampers for all our corporate events. The quality and packaging are consistently excellent. Highly recommended!",
      rating: 5,
      location: "Hi-Tech City"
    },
    {
      name: "Anita Reddy",
      role: "Wedding Client",
      content: "They made our dream wedding cake come true! The attention to detail and taste was beyond our expectations. Thank you Golden Bakery!",
      rating: 5,
      location: "Kondapur"
    }
  ];

  return (
    <section className="py-20 bg-gradient-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Customer Love
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our 
            <span className="bg-gradient-sunset bg-clip-text text-transparent"> Customers Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Six decades of serving happiness, one satisfied customer at a time.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.name} className="border-0 shadow-soft hover:shadow-warm transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-primary/30" />
                </div>
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                {/* Customer Info */}
                <div className="border-t border-border pt-6">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-xs text-primary mt-1">{testimonial.location}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-golden rounded-2xl p-12 shadow-glow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">4.9★</div>
              <div className="text-primary-foreground/80 text-sm">Customer Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">100k+</div>
              <div className="text-primary-foreground/80 text-sm">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">500+</div>
              <div className="text-primary-foreground/80 text-sm">Daily Orders</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-foreground mb-2">25</div>
              <div className="text-primary-foreground/80 text-sm">Store Locations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;