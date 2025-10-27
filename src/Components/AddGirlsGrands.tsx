import { useAppSelector } from '@/redux/hooks';
import type { RootState } from '@/redux/store/store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

function AddGirlsGrands() {

  const topwearSubcategories = ["T-Shirt", "Top", "Blouse", "Frock"];
  const bottomwearSubcategories = ["Jeans", "Skirts", "Leggings", "Shorts", "Capris"];
  const footwearSubcategories = ["Sandals", "Ballerinas", "Sneakers", "Boots", "Slippers"];

  const clothingMaterials = ["Cotton", "Polyester", "Denim", "Silk Blend", "Net"];
  const footwearMaterials = ["Synthetic", "Canvas", "Rubber", "Leather"];

  const clothingSizes = ["2-3 years", "4-5 years", "6-7 years", "8-9 years", "10-11 years", "12-13 years"];
  const footwearSizes = ["8 (Kids)", "9 (Kids)", "10 (Kids)", "11 (Kids)", "12 (Kids)", "13 (Kids)", "1 (Youth)", "2 (Youth)", "3 (Youth)"];
  const colors = ["White", "Black", "Gray", "Red", "Blue", "Yellow", "Pink", "Purple", "Brown", "Beige", "Multi"];



  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const sellerID = useAppSelector((state: RootState) => state.sellerAuth.sellerData?.sellerId);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [serverError, setServerError] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [totalStock, setTotalStock] = useState(0);

  const [focusTarget, setFocusTarget] = useState<string | null>(null);
  const stockRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});



  const watchedAll = useWatch({ control }) || {};
  const watchedVariant = watchedAll.variant || {};

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const calculateTotalStock = useCallback(() => {
    const variants = getValues('variant');
    let total = 0;

    selectedSizes.forEach((size) => {
      colors.forEach((color) => {
        const variant = variants?.[size]?.[color];
        if (variant?.selected && variant.stock !== undefined) {
          total += Number(variant.stock) || 0;
        }
      });
    });

    setTotalStock(total);
  }, [selectedSizes, getValues]);

  useEffect(() => {
    calculateTotalStock();
  }, [calculateTotalStock]);

  // Handle focus
  useEffect(() => {
    if (focusTarget) {
      const input = stockRefs.current[focusTarget];
      const inut = stockRefs.current[focusTarget]?.value;
      if (input) {
        input.focus();
        console.log(inut);
      }
    }
  }, [focusTarget]);

  // Watch the category field to conditionally render other fields
  const product_Type = watch("productType");

  const currentSizes =
    ["Topwear", "Bottomwear"].includes(product_Type)
      ? clothingSizes
      : product_Type === "Footwear"
        ? footwearSizes
        : [];



  const onSubmit = async (data: any) => {

    const groupedVariants: { [size: string]: { size: string, variants: { color: string, stock: number }[] } } = {};

    selectedSizes.forEach((size) => {
      // Har size ke liye ek entry banayein
      groupedVariants[size] = {
        size: size,
        variants: [], // Is size ke liye colors ka array
      };

      colors.forEach((color) => {
        const isChecked = getValues(`variant.${size}.${color}.selected`);
        const stock = getValues(`variant.${size}.${color}.stock`);

        if (isChecked) {
          const numericStock = Number(stock) || 0;
          // Color aur stock ko sahi size ke andar push karein
          groupedVariants[size].variants.push({ color, stock: numericStock });
        }
      });
    });

    // 2. Ab is object ko ek array of values mein convert karein
    const variants = Object.values(groupedVariants);
    const formData = new FormData();

    Object.entries({
      ...data,
      sellerID: sellerID,
      gender: "Female", // Changed gender to Female
      collection: category,
      totalStock: totalStock
    }).forEach(([key, value]) => {
      if (key === "variant") {
        return;
      }

      if (typeof value === "string") {
        formData.append(key, value);
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append("variants", JSON.stringify(variants));

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      alert("Please select at least one image.");
      return;
    }

    try {
      // Updated API endpoint to girls-clothing
      const response = await fetch("http://localhost:6173/api/addProduct/girls-grands", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const jsonData = await response.json();

      if (response.ok) {
        alert("Product added successfully!");
        reset();
        setFiles([]);
      } else {
        alert(`Error: ${jsonData.message || "Something went wrong"}`);
        setServerError(jsonData.message);
      }
    } catch (error) {
      alert("Network error. Please try again.");
      setServerError(String(error));
    }
  };


  return (
    <div>
      <h1 className='mt-20'>Add Girls Clothing & Footwear</h1>
      <br /><br />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <input {...register("name", { required: "Product Name is required" })} placeholder="Product Name" type="text" />
        <br /><br />

        <input {...register("brand", { required: "Brand is required" })} placeholder="Brand Name" type="text" />
        <br /><br />


        <input {...register("category", { required: "Category is required" })} placeholder="Category" value={category ?? ""} readOnly type="text" />
        <br /><br />

        {/* Dynamic Category Selection */}
        <select {...register("productType", { required: true })} defaultValue="">
          <option value="" disabled>Select Category</option>
          <option value="Topwear">Topwear</option>
          <option value="Bottomwear">Bottomwear</option>
          <option value="Footwear">Footwear</option>
        </select>
        <br /><br />

        {/* Subcategory options based on selected Category */}
        {product_Type === "Topwear" && (
          <>
            <select {...register("subCategory", { required: true })} defaultValue="">
              <option value="" disabled>Select Subcategory</option>
              {topwearSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <br /><br />
          </>
        )}
        {product_Type === "Bottomwear" && (
          <>
            <select {...register("subCategory", { required: true })} defaultValue="">
              <option value="" disabled>Select Subcategory</option>
              {bottomwearSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <br /><br />
          </>
        )}
        {product_Type === "Footwear" && (
          <>
            <select {...register("subCategory", { required: true })} defaultValue="">
              <option value="" disabled>Select Subcategory</option>
              {footwearSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <br /><br />
          </>
        )}

        {/* Pricing */}
        <input {...register("price", { required: "Price is required", valueAsNumber: true })} placeholder="Price" type="number" />
        <br /><br />

        <input {...register("discount", { valueAsNumber: true })} placeholder="Discount (%)" type="number" />
        <br /><br />


        {/* Material & Features based on selected Category */}
        {["Topwear", "Bottomwear"].includes(product_Type) && (
          <>
            <select {...register("material")} defaultValue="">
              <option value="" disabled>Select Material</option>
              {clothingMaterials.map(mat => <option key={mat} value={mat}>{mat}</option>)}
            </select>
            <br /><br />
          </>
        )}

        {product_Type === "Topwear" && (
          <>
            <select {...register("sleeve")} defaultValue="">
              <option value="" disabled>Choose Sleeve Type</option>
              <option value="Half Sleeve">Half Sleeve</option>
              <option value="Full Sleeve">Full Sleeve</option>
              <option value="Sleeveless">Sleeveless</option>
            </select>
            <br /><br />
            <select {...register("neck")} defaultValue="">
              <option value="" disabled>Choose Neck Type</option>
              <option value="Round Neck">Round Neck</option>
              <option value="Collar Neck">Collar Neck</option>
              <option value="V-Neck">V-Neck</option>
            </select>
            <br /><br />
          </>
        )}

        {product_Type === "Footwear" && (
          <>
            <select {...register("outerMaterial")} defaultValue="">
              <option value="" disabled>Select Outer Material</option>
              {footwearMaterials.map(mat => <option key={mat} value={mat}>{mat}</option>)}
            </select>
            <br /><br />
          </>
        )}
        
        <br /><br />
        {/* Variants */}
        <fieldset>
          <legend>Variant</legend>
          <label>Select Sizes:</label>
          <div className="flex gap-4 mt-2">
            {currentSizes.map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  onChange={() => toggleSize(size)}
                  checked={selectedSizes.includes(size)}
                />
                {size}
              </label>
            ))}
          </div>
          <br />
          {selectedSizes.map((size) => (
            <div key={size} className="mb-6">
              <h4 className="font-semibold">{size}</h4>
              <div className="grid grid-cols-2 gap-4">
                {colors.map((color) => {
                  const isChecked = watchedVariant?.[size]?.[color]?.selected;
                  const key = `${size}-${color}`;
                  return (
                    <div key={color} className="flex items-center gap-4">
                      <label>
                        <input
                          type="checkbox"
                          {...register(`variant.${size}.${color}.selected`, {
                            onChange: (e) => {
                              if (e.target.checked) {
                                setFocusTarget(key);
                              }
                            }
                          })}
                        />
                        {color}
                      </label>
                      <input
                        type="number"
                        placeholder="Stock"
                        disabled={!isChecked}
                        {...register(`variant.${size}.${color}.stock`, {
                          valueAsNumber: true,
                          required: isChecked ? "Stock is required." : false,
                          min: { value: 1, message: "Minimum stock is 1." },
                          onChange: (e) => {
                            const newValue = Number(e.target.value) || 0;
                            setValue(`variant.${size}.${color}.stock`, newValue);
                            calculateTotalStock();
                          }
                        })}
                        ref={(el) => {
                          stockRefs.current[key] = el;
                        }}
                        className={`border px-2 py-1 w-24 ${!isChecked ? 'bg-gray-200' : ''}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <label>Total Stock:{totalStock}</label>
          {errors.variant && (
            <div className="text-red-500 mt-2">
              {Object.keys(errors.variant).map((sizeKey: string) =>
                Object.keys((errors.variant as any)[sizeKey]).map((colorKey: string) =>
                  (errors.variant as any)[sizeKey][colorKey].stock && (
                    <p key={`${sizeKey}-${colorKey}`}>{
                      (errors.variant as any)[sizeKey][colorKey].stock.message
                    }</p>
                  )
                )
              )}
            </div>
          )}
        </fieldset>
        <br /><br />

        {/* Images */}
        <input
          key="file-input" // Static key
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || []);
            setFiles(selectedFiles);
          }}
        />
        <br /><br />

        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        {serverError && <span>{serverError}</span>}
      </form>
    </div>
  );
}

export default AddGirlsGrands;