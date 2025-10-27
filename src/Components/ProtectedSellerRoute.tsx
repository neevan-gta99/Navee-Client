import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store/store';
import { Navigate } from 'react-router-dom';

const ProtectedSellerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.sellerAuth);

  if (loading) return <p>Checking authentication...</p>;
  if (!isAuthenticated) return <Navigate to="/seller/login" replace />;

  return <>{children}</>;
};

export default ProtectedSellerRoute;