import "./globals.css";
import { STORE } from "../lib/config";

export const metadata = { title: STORE.name };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header className="top">
          <div className="wrap">
            <a href="/">{STORE.name}</a>
          </div>
        </header>
        <main className="wrap">{children}</main>
      </body>
    </html>
  );
}
