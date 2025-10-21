import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Army Camp Location and Contact",
  description: "বাংলাদেশ সেনাবাহিনী ক্যাম্প লোকেশান এবং কন্টাক্ট নাম্বার",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`next_map`}>{children}</body>
    </html>
  );
}
