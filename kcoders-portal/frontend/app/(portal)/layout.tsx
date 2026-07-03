import PortalLayout from '@/components/shared/PortalLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PortalLayout>{children}</PortalLayout>;
}
