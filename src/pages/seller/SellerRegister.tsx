import { useAppSelector } from "@/redux/hooks";
import type { RootState } from "@/redux/store/store";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { BASE_URL } from '@/config/apiConfig.ts';

const SellerRegister = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();


   const { pathname } = useLocation();

    const loginTimestamp = useAppSelector((state: RootState) => state.sellerAuth.loginTimestamp);
    
    useEffect(()=>{

        if(loginTimestamp != null){
           navigate('/seller/profile');
        }
        

    },[pathname])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({ mode: "onChange" });

  const gstDoc = watch("gstDoc");
  const panDoc = watch("panDoc");
  const businessType = watch("businessType");

  const isFormReady =
    isValid &&
    businessType !== "" &&
    gstDoc?.length > 0 &&
    panDoc?.length > 0;

  const onSubmit = async (data: any) => {
    
    setServerError("");

    const duplicateRegisterCheckUrl = `${BASE_URL}/seller/register/check`;
    const registerUrl = `${BASE_URL}/seller/register`;

    const formData = new FormData();

    // Append all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "gstDoc" && key !== "panDoc") {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          formData.append(key, String(value));
        }
      }
    });

    // Append files
    if (data.gstDoc?.[0]) formData.append("gstDoc", data.gstDoc[0]);
    if (data.panDoc?.[0]) formData.append("panDoc", data.panDoc[0]);

    try {

      const duplicateCheckPayload = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName,
        gstNumber: data.gstNumber,
        panNumber: data.panNumber,
        pickupAddress: data.pickupAddress,
        accountHolder: data.accountHolder,
        accountNumber: data.accountNumber,
      };
      console.log(duplicateCheckPayload);
      
      const duplicateRes = await fetch(duplicateRegisterCheckUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateCheckPayload),
        credentials: "include",
      });

      let duplicateData = await duplicateRes.json() as { message?: string };

      if (!duplicateRes.ok) {
        setServerError(duplicateData.message || "Duplicate data found.");
        return;
      }

      // Proceed to actual registration
      try {
        const registerRes = await fetch(registerUrl, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        let registerData = await registerRes.json() as { message?: string };

        if (registerRes.ok) {
          navigate("/seller/login");
          console.log(registerData.message || "Registration successful");
        } else {
          setServerError(registerData.message || "Registration failed.");
        }
      } catch (error) {
        setServerError("Server error during registration.");
        console.error("Register failed:", error);
      }

    } catch (error) {
      setServerError("Server error during duplicate check.");
      console.error("Duplicate check failed:", error);
    }
  };

  return (
    <>
      <h1>Register Page</h1>
      <br /><br />
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.businessType && <p style={{ color: "red" }}>Business type is required</p>}
          {errors?.fullName && typeof errors.fullName.message === "string" && (
            <p style={{ color: "red" }}>{errors.fullName.message}</p>
          )}
          {errors?.confirmPassword && typeof errors.confirmPassword.message === "string" && (
            <p style={{ color: "red" }}>{errors.confirmPassword.message}</p>
          )}

          <input {...register("fullName", { required: "Name is required" })} placeholder="Full Name" />
          <br /><br />
          <input {...register("email", { required: "Email is required" })} placeholder="Email" type="email" />
          <br /><br />
          <input {...register("phone", { required: "Phone is required" })} placeholder="Phone Number" />
          <br /><br />
          <input {...register("password", { required: "Password is required" })} placeholder="Password" type="password" />
          <br /><br />
          <input {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) => value === watch("password") || "Passwords do not match"
          })} placeholder="Confirm Password" type="password" />
          <br /><br />

          <input {...register("businessName", { required: "Business name is required" })} placeholder="Business Name" />
          <br /><br />
          <input {...register("gstNumber", { required: "GST number is required" })} placeholder="GST Number" />
          <br /><br />
          <input {...register("panNumber", { required: "PAN number is required" })} placeholder="PAN Number" />
          <br /><br />
          <select {...register("businessType", { required: true })}>
            <option value="">Select Business Type</option>
            <option value="individual">Individual</option>
            <option value="company">Company</option>
            <option value="partnership">Partnership</option>
          </select>
          <br /><br />

          <input {...register("pickupAddress", { required: true })} placeholder="Pickup Address" />
          <br /><br />
          <input {...register("pincode", { required: true })} placeholder="Pincode" type="number" />
          <br /><br />
          <input {...register("city", { required: true })} placeholder="City" />
          <br /><br />
          <input {...register("state", { required: true })} placeholder="State" />
          <br /><br />

          <input {...register("accountHolder", { required: true })} placeholder="Account Holder Name" />
          <br /><br />
          <input {...register("accountNumber", { required: true })} placeholder="Account Number" />
          <br /><br />
          <input {...register("ifsc", { required: true })} placeholder="IFSC Code" />
          <br /><br />
          <input {...register("bankName", { required: true })} placeholder="Bank Name" />
          <br /><br />

          <select {...register("courierPartner")}>
            <option value="">Preferred Courier Partner</option>
            <option value="delhivery">Delhivery</option>
            <option value="ekart">Ekart</option>
            <option value="bluedart">BlueDart</option>
          </select>
          <br /><br />
          <label>
            <input {...register("hasWarehouse")} type="checkbox" />
            Do you have a warehouse?
          </label>
          <br /><br />

          <label>Upload GST Certificate</label>
          <input {...register("gstDoc")} type="file" accept=".pdf,.jpg,.png" />
          <br /><br />
          <label>Upload PAN Card</label>
          <input {...register("panDoc")} type="file" accept=".pdf,.jpg,.png" />
          <br /><br />

          <button disabled={isSubmitting || !isFormReady}>
            {isSubmitting ? "Submitting..." : "Register as Seller"}
          </button>
          {serverError && <p style={{ color: "red" }}>{serverError}</p>}
        </form>
      </div>
    </>
  );
};

export default SellerRegister;
