import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Heart, Clock } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Made with Love",
      description: "Every product is crafted with genuine care and attention to detail, just like homemade treats.",
      color: "text-bakery-berry"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "We use only the finest ingredients sourced from trusted suppliers around the world.",
      color: "text-primary"
    },
    {
      icon: Clock,
      title: "Traditional Methods",
      description: "Our time-honored baking techniques have been perfected over six decades of experience.",
      color: "text-bakery-crust"
    },
    {
      icon: Users,
      title: "Family Legacy",
      description: "A family business that has grown with our community, serving generations of loyal customers.",
      color: "text-accent"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
            Our Heritage
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Six Decades of 
            <span className="bg-gradient-sunset bg-clip-text text-transparent"> Excellence</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Story Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold mb-4">The Karachi Bakery Story</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  A staggering chronicle of six decades and still going strong, Karachi Bakery has emerged as a 
                  <span className="font-semibold text-primary"> "True Icon of Artisanal Baking"</span> with a reputation 
                  that is unmatched to the core.
                </p>
                <p>
                  Always a step ahead of competition, we focus on innovation, developing new products while improving 
                  our existing recipes to meet evolving consumer needs and dietary preferences.
                </p>
                <p>
                  A subtle combination of traditions and trends, our extensive collection of greatly appetizing 
                  baked goods and confections delights the senses of all age groups and people from different walks of life.
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-cream rounded-xl">
                <div className="text-4xl font-bold text-primary mb-2">60+</div>
                <div className="text-sm text-muted-foreground">Years of Heritage</div>
              </div>
              <div className="text-center p-6 bg-gradient-cream rounded-xl">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Products Daily</div>
              </div>
              <div className="text-center p-6 bg-gradient-cream rounded-xl">
                <div className="text-4xl font-bold text-primary mb-2">25</div>
                <div className="text-sm text-muted-foreground">Locations</div>
              </div>
              <div className="text-center p-6 bg-gradient-cream rounded-xl">
                <div className="text-4xl font-bold text-primary mb-2">100k+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold mb-8">What Makes Us Special</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value) => (
                <Card key={value.title} className="border-0 shadow-soft">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-background shadow-soft mb-4 ${value.color}`}>
                      <value.icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold mb-2">{value.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Statement - No hover effects */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-golden p-12 rounded-2xl shadow-glow max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-primary-foreground mb-6">Our Mission</h3>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              To preserve the art of traditional baking while embracing innovation, creating memorable experiences 
              through exceptional baked goods that bring families and communities together, one delicious bite at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;