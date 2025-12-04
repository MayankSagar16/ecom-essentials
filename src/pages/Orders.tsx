import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  shipping_address: string | null;
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-display text-2xl font-semibold text-foreground mb-4">
            Sign in to view your orders
          </h1>
          <Button asChild size="lg">
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-muted rounded w-48" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-display text-2xl font-semibold text-foreground mb-4">
            No orders yet
          </h1>
          <p className="font-body text-muted-foreground mb-8">
            Start shopping to place your first order
          </p>
          <Button asChild size="lg">
            <Link to="/shop">Shop Now</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-12">
          My Orders
        </h1>

        <div className="space-y-4">
          {orders.map((order, index) => (
            <div 
              key={order.id} 
              className="bg-card rounded-lg p-6 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-body text-sm text-muted-foreground">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="font-display text-lg font-medium text-foreground">
                    ${Number(order.total_amount).toFixed(2)}
                  </p>
                  <p className="font-body text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`font-body text-sm px-3 py-1 rounded-full ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {order.shipping_address && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="font-body text-sm text-muted-foreground">
                    <span className="font-medium">Shipping to:</span> {order.shipping_address}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link to="/shop">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
