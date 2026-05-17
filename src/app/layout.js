import './globals.css';

export const metadata = {
  title: 'CHEEZARILLA — Where Every Bite Melts With Flavor',
  description: 'Premium Pakistani restaurant serving gourmet burgers, loaded fries, pizza, fried chicken, and more. Experience the ultimate cheese-filled fast food in Islamabad.',
  keywords: 'CHEEZARILLA, Pakistani restaurant, burgers, pizza, loaded fries, fast food, Islamabad',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
