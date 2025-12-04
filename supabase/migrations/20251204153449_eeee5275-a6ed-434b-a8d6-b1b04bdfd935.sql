-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Products policies (public read, no write for regular users)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Cart items policies
CREATE POLICY "Users can view their own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create order items for their orders" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Create trigger function for profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category, stock_quantity, featured) VALUES
('Minimalist Leather Tote', 'Handcrafted Italian leather tote with brass hardware. Perfect for everyday elegance.', 289.00, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600', 'Bags', 15, true),
('Cashmere Crewneck Sweater', 'Ultra-soft 100% cashmere sweater in timeless neutrals. Relaxed fit.', 195.00, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600', 'Clothing', 25, true),
('Ceramic Pour-Over Set', 'Artisan-made ceramic dripper with matching carafe. Brew coffee like a barista.', 78.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', 'Home', 40, true),
('Wool Blend Overcoat', 'Tailored silhouette in premium wool blend. The perfect layering piece.', 425.00, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600', 'Clothing', 12, true),
('Organic Cotton Tee', 'Essential crew neck in organic cotton. Relaxed fit, refined details.', 48.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 'Clothing', 100, false),
('Brass Desk Lamp', 'Adjustable task lamp with warm brass finish. Timeless design meets function.', 165.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600', 'Home', 20, false),
('Linen Button-Down', 'Breathable linen shirt for warm days. Effortlessly sophisticated.', 115.00, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', 'Clothing', 35, false),
('Hand-Thrown Vase', 'Unique stoneware vase by local artisans. Each piece is one-of-a-kind.', 89.00, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600', 'Home', 18, false),
('Merino Wool Scarf', 'Luxuriously soft merino wool in versatile charcoal. Lightweight warmth.', 75.00, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600', 'Accessories', 50, false),
('Canvas Weekender', 'Waxed canvas with leather trim. Your go-to for weekend adventures.', 198.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 'Bags', 22, true),
('Silk Sleep Set', 'Pure mulberry silk pajamas. Indulgent comfort for restful nights.', 245.00, 'https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=600', 'Clothing', 15, false),
('Handwoven Throw', 'Artisan-crafted throw blanket in natural fibers. Adds warmth to any space.', 135.00, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', 'Home', 28, false);