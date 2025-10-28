import { BASE_URL } from '@/config/apiConfig';
import { useAppSelector } from '@/redux/hooks';
import type { RootState } from '@/redux/store/store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

function AddWomenEthnic() {

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const colors = ["White", "Black", "Navy", "Gray", "Charcoal", "Red", "Blue", "Green", "Yellow", "Pink", "Purple", "Brown", "Beige", "Khaki", "Maroon", "Olive", "Teal", "Cream", "Multi"];

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

  const onSubmit = async (data: any) => {

    const groupedVariants: { [size: string]: { size: string, variants: { color: string, stock: number }[] } } = {};

    selectedSizes.forEach((size) => {
      
      groupedVariants[size] = {
        size: size,
        variants: [], 
      };

      colors.forEach((color) => {
        const isChecked = getValues(`variant.${size}.${color}.selected`);
        const stock = getValues(`variant.${size}.${color}.stock`);

        if (isChecked) {
          const numericStock = Number(stock) || 0;
          
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
      gender: "Female", 
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
      // Updated API endpoint
      const response = await fetch(`${BASE_URL}/api/addProduct/women-ethnic`, {
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
      <h1 className='mt-20'>Add Women's Ethnic Wear</h1>
      <br /><br />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <input {...register("name", { required: "Product Name is required" })} placeholder="Product Name" type="text" />
        <br /><br />

        <input {...register("brand", { required: "Brand is required" })} placeholder="Brand Name" type="text" />
        <br /><br />

        <input {...register("category", { required: "Category is required" })} placeholder="Category" value={category ?? ""} readOnly type="text" />
        <br /><br />

        <select {...register("subCategory", { required: true })} defaultValue="">
          <option value="" disabled>Select Subcategory</option>
          <option value="Saree">Saree</option>
          <option value="Kurta">Kurta</option>
          <option value="Salwar Suit">Salwar Suit</option>
          <option value="Lehenga Choli">Lehenga Choli</option>
          <option value="Gown">Gown</option>
        </select>
        <br /><br />

        {/* Pricing */}
        <input {...register("price", { required: "Price is required", valueAsNumber: true })} placeholder="Price" type="number" />
        <br /><br />

        <input {...register("discount", { valueAsNumber: true })} placeholder="Discount (%)" type="number" />
        <br /><br />

        {/* Material & Features */}
        <select {...register("material", { required: true })} defaultValue="">
          <option value="" disabled>Select Material</option>
          <option value="Cotton">Cotton</option>
          <option value="Silk">Silk</option>
          <option value="Georgette">Georgette</option>
          <option value="Chiffon">Chiffon</option>
          <option value="Rayon">Rayon</option>
          <option value="Velvet">Velvet</option>
          <option value="Net">Net</option>
        </select>
        <br /><br />

        <select {...register("sleeve")} defaultValue="">
          <option value="" disabled>Choose Sleeve Type</option>
          <option value="Half Sleeve">Half Sleeve</option>
          <option value="Full Sleeve">Full Sleeve</option>
          <option value="Sleeveless">Sleeveless</option>
          <option value="3/4 Sleeve">3/4 Sleeve</option>
        </select>
        <br /><br />

        <select {...register("neck")} defaultValue="">
          <option value="" disabled>Choose Neck Type</option>
          <option value="Round Neck">Round Neck</option>
          <option value="V-Neck">V-Neck</option>
          <option value="Boat Neck">Boat Neck</option>
          <option value="Mandarin Collar">Mandarin Collar</option>
          <option value="Square Neck">Square Neck</option>
        </select>
        <br /><br />

        {/* Design Attributes */}
        <select {...register("pattern")} defaultValue="">
          <option value="" disabled>Select Pattern</option>
          <option value="Solid">Solid</option>
          <option value="Printed">Printed</option>
          <option value="Embroidered">Embroidered</option>
          <option value="Woven">Woven</option>
          <option value="Embellished">Embellished</option>
        </select>
        <br /><br />

        <select {...register("fit")} defaultValue="">
          <option value="" disabled>Select Fit</option>
          <option value="Regular">Regular</option>
          <option value="A-Line">A-Line</option>
          <option value="Anarkali">Anarkali</option>
          <option value="Straight">Straight</option>
        </select>
        <br /><br />

        {/* Variants */}
        <fieldset>
          <legend>Variant</legend>
          <label>Select Sizes:</label>
          <div className="flex gap-4 mt-2">
            {sizes.map((size) => (
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

export default AddWomenEthnic;