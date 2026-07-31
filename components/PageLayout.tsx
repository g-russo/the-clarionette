import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER SECTION */}
      <Header />

      {/* BODY SECTION */}
      <div className="flex-grow">
        {children}
      </div>

      {/* FOOTER SECTION */}
      <Footer />
    </div>
  );
}
