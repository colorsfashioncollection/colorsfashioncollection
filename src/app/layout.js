import Auth from "./auth";
import Providers from "./providers";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  // metadataBase: new URL("https://canim-csr.vercel.app"),
  title: "Colors Fashion Collection",
  description:
    "",
  openGraph: {
    title: "Colors Fashion Collection",
    description:
      "",
    // url: "https://canim-csr.vercel.app",
    siteName: "Colors Fashion Collection",
    
  },
 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Auth>{children}</Auth>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
