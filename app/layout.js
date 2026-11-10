import "./globals.css";
import { STORE } from "../lib/config";
import { CartProvider } from "../components/CartProvider";
import CartLink from "../components/CartLink";

export const metadata = { title: STORE.name };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <header className="top">
            <div className="wrap">
              <a href="/">{STORE.name}</a>
              <span className="spacer" />
              <CartLink />
            </div>
          </header>
          <main className="wrap">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
