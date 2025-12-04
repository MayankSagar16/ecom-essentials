import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  stock_quantity: number;
}

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-[3/4] bg-muted rounded-lg" />
            <div className="space-y-6">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-24" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Product not found</h1>
          <Button asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back button */}
        <Link 
          to="/shop" 
          className="inline-flex items-center font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-card animate-fade-in">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <p className="font-body text-sm text-primary uppercase tracking-widest">
                {product.category}
              </p>
              <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground">
                {product.name}
              </h1>
              <p className="font-display text-2xl text-foreground">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <p className="font-body text-muted-foreground leading-relaxed">
              {product.description || 'A thoughtfully crafted piece designed for everyday elegance. Quality materials meet timeless design in this essential addition to your collection.'}
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-body text-sm text-muted-foreground">
                {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity selector */}
            <div className="space-y-3">
              <label className="font-body text-sm font-medium text-foreground">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-body">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="p-3 hover:bg-muted transition-colors"
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to cart */}
            <Button 
              onClick={handleAddToCart}
              size="lg"
              className="w-full h-14"
              disabled={product.stock_quantity === 0}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart — ${(product.price * quantity).toFixed(2)}
            </Button>

            {/* Details */}
            <div className="border-t border-border pt-8 space-y-4">
              <h3 className="font-body text-sm font-semibold text-foreground uppercase tracking-wider">
                Details
              </h3>
              <ul className="font-body text-sm text-muted-foreground space-y-2">
                <li>Premium quality materials</li>
                <li>Thoughtfully designed for everyday use</li>
                <li>Free shipping on orders over $100</li>
                <li>30-day return policy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
