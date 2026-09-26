'use client';

import { useRefreshContext } from '@/providers/refresh-provider';

// Swap a region for its skeleton while a refetch is in flight.
//
// The refetch is started by a row action or a dialog somewhere inside the page,
// and the skeleton that should stand in for it is a Server Component that the
// page already knows how to render — so the skeleton arrives as a prop rather
// than as an import here.
//
// Use it where `loading.tsx` cannot help: a `loading.tsx` only covers a route
// navigation, and a refetch triggered by a save happens without one.
export function RefetchSkeleton({
  skeleton,
  children,
}: {
  skeleton: React.ReactNode;
  children: React.ReactNode;
}) {
  const { isRefreshing } = useRefreshContext();

  return <>{isRefreshing ? skeleton : children}</>;
}

export default RefetchSkeleton;
