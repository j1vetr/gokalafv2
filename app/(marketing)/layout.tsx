import { NavbarSSR } from '../../components/layout/NavbarSSR';
import { FooterSSR } from '../../components/layout/FooterSSR';
import { WhatsAppButton } from '../../components/WhatsAppButton';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black">
      <NavbarSSR />
      <main>{children}</main>
      <FooterSSR />
      <WhatsAppButton />
    </div>
  );
}
