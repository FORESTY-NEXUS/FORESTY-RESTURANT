import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';
import './globals.css';

export const metadata = {
  title: 'FORESTY RESTURANT - Where Every Bite Melts With Flavor',
  description: 'FORESTY RESTURANT is a premium Pakistani restaurant serving gourmet burgers, loaded fries, pizza, fried chicken, and more in Islamabad.',
  keywords: 'FORESTY, FORESTY RESTURANT, Pakistani restaurant, burgers, pizza, loaded fries, fast food, Islamabad',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='"w-full min-h-screen overflow-x-hidden bg-[#1c1c1c] relative'>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
