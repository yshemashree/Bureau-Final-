import { DemoProvider } from '@/lib/demo-context';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      {children}
    </DemoProvider>
  );
}
