import { ReactNode } from "react";
import { Providers } from "./providers";
import "../styles/index.css";

export const metadata = {
  title: "Catatan",
  description: "Aplikasi catatan",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
