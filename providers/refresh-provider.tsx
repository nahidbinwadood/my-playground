'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
} from 'react';

// What a refetch looks like from the page's point of view.
//
// `router.refresh()` on its own gives the caller no signal: the old tree simply
// stays on screen until the fresh payload arrives, so a delete or a publish
// toggle reads as "nothing happened". Running the refresh inside a transition is
// what produces a pending flag — and that flag is what lets the page swap in its
// own skeleton while the server re-renders.
//
// The flag lives here rather than in each table because the component that
// triggers the refetch (a row action, a dialog) is never the component that owns
// the skeleton. One provider, mounted once in the admin shell, is the shared
// seam between them.
type TRefreshContext = {
  /** True from the moment a refetch starts until the fresh tree commits. */
  isRefreshing: boolean;
  /** Re-render the current route's Server Components, with a pending flag. */
  refresh: () => void;
};

const RefreshContext = createContext<TRefreshContext | null>(null);

const RefreshProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const value = useMemo(
    () => ({ isRefreshing: isPending, refresh }),
    [isPending, refresh]
  );

  return (
    <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>
  );
};

export default RefreshProvider;

export const useRefreshContext = () => {
  const ctx = useContext(RefreshContext);
  if (!ctx) {
    throw new Error('useRefreshContext must be used inside RefreshProvider');
  }
  return ctx;
};
