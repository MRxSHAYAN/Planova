import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="font-sans antialiased text-[#0B0F1A]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
