import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <p className="font-body text-sm font-medium text-primary uppercase tracking-widest">
                New Collection
              </p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.1]">
                Timeless<br />
                <span className="text-primary">Essentials</span>
              </h1>
              <p className="font-body text-lg text-muted-foreground max-w-md leading-relaxed">
                Curated pieces crafted with intention. Quality materials, thoughtful design, 
                built to last beyond seasons.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="group">
                <Link to="/shop">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/shop?featured=true">
                  View Featured
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div 
                  className="aspect-[3/4] rounded-lg overflow-hidden shadow-elevated animate-fade-in"
                  style={{ animationDelay: '200ms' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600"
                    alt="Leather bag"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div 
                  className="aspect-square rounded-lg overflow-hidden shadow-card animate-fade-in"
                  style={{ animationDelay: '400ms' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600"
                    alt="Sweater"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div 
                  className="aspect-[4/3] rounded-lg overflow-hidden shadow-card animate-fade-in"
                  style={{ animationDelay: '600ms' }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600"
                    alt="Ceramic set"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
