import Home from './Components/Home';
import AppRoutes from './Routes';
import { useEffect } from 'react';
import { fetchSellerAuth } from './redux/features/seller/sellerAuthSlice';
import { useAppDispatch } from './redux/hooks';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSellerAuth());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
