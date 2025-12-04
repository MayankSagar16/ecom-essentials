import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Clothing',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
    description: 'Timeless wardrobe essentials',
  },
  {
    name: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    description: 'Crafted for everyday journeys',
  },
  {
    name: 'Home',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
    description: 'Objects for thoughtful living',
  },
];

export function Categories() {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-body text-sm font-medium text-primary uppercase tracking-widest mb-2">
            Explore
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold text-foreground">
            Shop by Category
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Link 
              key={category.name}
              to={`/shop?category=${category.name}`}
              className="group relative overflow-hidden rounded-lg aspect-[4/5] animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                <h3 className="font-display text-2xl lg:text-3xl font-semibold text-background mb-2">
                  {category.name}
                </h3>
                <p className="font-body text-sm text-background/80">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
