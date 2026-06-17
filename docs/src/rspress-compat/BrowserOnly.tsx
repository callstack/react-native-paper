import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type BrowserOnlyProps = {
  children: () => ReactNode;
  fallback?: ReactNode;
};

export default function BrowserOnly({ children, fallback }: BrowserOnlyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children()}</> : <>{fallback ?? null}</>;
}
