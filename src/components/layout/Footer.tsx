import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              Maison
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Curated essentials for modern living. Quality craftsmanship, timeless design.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-body text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Clothing" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Bags" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Bags
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Home" className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-body text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="font-body text-sm text-muted-foreground">About Us</span>
              </li>
              <li>
                <span className="font-body text-sm text-muted-foreground">Sustainability</span>
              </li>
              <li>
                <span className="font-body text-sm text-muted-foreground">Careers</span>
              </li>
              <li>
                <span className="font-body text-sm text-muted-foreground">Press</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-body text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="font-body text-sm text-muted-foreground">FAQ</span>
              </li>
              <li>
                <span className="font-body text-sm text-muted-foreground">Shipping & Returns</span>
              </li>
              <li>
                <span className="font-body text-sm text-muted-foreground">Contact</span>
              </li>
              <li>
                <span className="font-body text-sm text-muted-foreground">Size Guide</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="font-body text-sm text-muted-foreground">
            © 2024 Maison. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="font-body text-sm text-muted-foreground">Privacy</span>
            <span className="font-body text-sm text-muted-foreground">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
