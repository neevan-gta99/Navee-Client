import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setLoginSession } from "@/redux/features/seller/sellerAuthSlice";
import type { RootState } from '@/redux/store/store';
import { BASE_URL } from '@/config/apiConfig.ts';




function SellerLogin() {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { pathname } = useLocation();

  const loginTimestamp = useAppSelector((state: RootState) => state.sellerAuth.loginTimestamp);

  useEffect(() => {

    if (loginTimestamp != null) {
      navigate('/seller/profile');
    }


  }, [pathname])


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    setServerError(''); // Reset previous errors
    try {
      const response = await fetch(`${BASE_URL}/api/seller/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: data.sellerId,
          password: data.password
        }),
        credentials: "include", // Cookie receive/send ke liye
      });

      const jsonData = await response.json();

      if (response.ok) {
        dispatch(setLoginSession({
          timestamp: Date.now(),
          sellerId: jsonData.sellerId
        }));
        navigate(`/seller/profile/${jsonData.sellerId}`);
      } else {
        setServerError(jsonData.message || "Login failed");
      }
    } catch (error) {
      setServerError("Network error");
    }
  };

  return (
    <div>
      <h2 className='mt-44'>Seller Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("sellerId", {
            required: "Seller ID is required",
          })}
          placeholder="Enter Seller ID"
        />
        <br /><br />

        <input
          {...register("password", {
            required: "Password is required",
          })}
          placeholder="Enter Password"
          type="password"
        />
        {errors.password?.message && typeof errors.password.message === 'string' && (
          <p style={{ color: 'red' }}>{errors.password.message}</p>
        )}

        <br /><br />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{ opacity: isSubmitting ? 0.5 : 1 }}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {serverError && (
          <p style={{ color: "red", marginTop: "10px" }}>{serverError}</p>
        )}
      </form>
    </div>
  );
}

export default SellerLogin;