import { RouterProvider, useRouter } from '@/lib/router';
import { CartProvider } from '@/lib/cart';
import { AuthProvider } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { lazy, Suspense } from 'react';
import { Loader } from '@/components/Loader';

const Home = lazy(() => import('@/pages/Home'));
const Shop = lazy(() => import('@/pages/Shop'));
const Men = lazy(() => import('@/pages/Men'));
const Women = lazy(() => import('@/pages/Women'));
const Shoes = lazy(() => import('@/pages/Shoes'));
const Clothing = lazy(() => import('@/pages/Clothing'));
const ProductDetails = lazy(() => import('@/pages/ProductDetails'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));
const Account = lazy(() => import('@/pages/Account'));
const Orders = lazy(() => import('@/pages/Orders'));
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Auth = lazy(() => import('@/pages/Auth'));
const Admin = lazy(() => import('@/pages/Admin'));

const pageMap: Record<string, typeof Home> = {
  '/': Home,
  '/shop': Shop,
  '/men': Men,
  '/women': Women,
  '/shoes': Shoes,
  '/clothing': Clothing,
  '/product/:slug': ProductDetails,
  '/cart': Cart,
  '/checkout': Checkout,
  '/wishlist': Wishlist,
  '/account': Account,
  '/orders': Orders,
  '/order/:id': OrderConfirmation,
  '/about': About,
  '/contact': Contact,
  '/faq': FAQ,
  '/auth': Auth,
  '/admin': Admin,
};

function Pages() {
  const { route } = useRouter();
  const Page = pageMap[route.path] || Home;
  return (
    <Suspense fallback={<Loader />}>
      <Page key={JSON.stringify(route.params)} />
    </Suspense>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Pages />
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
