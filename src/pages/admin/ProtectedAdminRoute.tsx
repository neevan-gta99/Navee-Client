import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store/store.ts';
import { Navigate } from 'react-router-dom';
import { logoutAdmin } from '@/redux/features/admin/adminAuthSlice';
import { useEffect } from 'react';

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, loginTimestamp } = useSelector(
    (state: RootState) => state.adminAuth
  );

  useEffect(() => {
    if (loginTimestamp) {
      const now = Date.now();
      const diff = now - loginTimestamp;

      if (diff > 3600000) {
        dispatch(logoutAdmin());
      }
    }
  }, [loginTimestamp]);

  if (loading) return <p>Checking authentication...</p>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};

export default ProtectedAdminRoute;
