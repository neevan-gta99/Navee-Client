import { BASE_URL } from '@/config/apiConfig.ts';
import { useAppSelector } from '@/redux/hooks';
import type { RootState } from '@/redux/store/store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

function AddSuitcases() {

  const suitcaseBrands = ["Samsonite", "American Tourister", "VIP", "Safari", "Delsey", "Travelpro"];
  const suitcaseMaterials = ["Polycarbonate", "ABS", "Aluminium"];
  const suitcaseSizes = ["Cabin (Up to 22 inch)", "Medium (23-27 inch)", "Large (28+ inch)"];
  const suitcaseFeatures = ["Expandable", "Spinner Wheels", "Water-resistant"];
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
      collection: category,
      totalStock: totalStock
    }).forEach(([key, value]) => {
      if (key === "variant") return;

      if (key === "features" && Array.isArray(value)) {
        value.forEach((feature) => {
          formData.append(key, typeof feature === "string" ? feature : JSON.stringify(feature));
        });
        return;
      }

      if (typeof value === "string" || typeof value === "number") {
        formData.append(key, value.toString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    formData.append("variants", JSON.stringify(variants));

    if (files.length > 0) {
      files.forEach((file) => formData.append("images", file));
    } else {
      alert("Please select at least one image.");
      return;
    }

    try {
      // Corrected API endpoint for a dedicated suitcase category
      const response = await fetch(`${BASE_URL}/api/addProduct/suitcases`, {
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
      <h1 className='mt-20'>Add a Suitcase</h1>
      <br /><br />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <input {...register("name", { required: "Product Name is required" })} placeholder="Product Name" type="text" />
        <br /><br />
        <br />

        <select {...register("brand", { required: "Brand is required" })} defaultValue="">
          <option value="" disabled>Select Brand</option>
          {suitcaseBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
        </select>
        <br /><br />
        <br />

        <input {...register("category")} value={category ?? ""} readOnly type="text" />
        <br /><br />

        <select {...register("gender", { required: "Gender is required" })} defaultValue="">
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Unisex">Unisex</option>
        </select>
        <br /><br />
        <br />

        <input {...register("capacity", { required: "Capacity is required", valueAsNumber: true })} placeholder="Capacity (in Litres)" type="number" />
        <br /><br />
        <br />

        <select {...register("material")} defaultValue="">
          <option value="" disabled>Select Material</option>
          {suitcaseMaterials.map(material => <option key={material} value={material}>{material}</option>)}
        </select>
        <br /><br />

        <select {...register("shellType")} defaultValue="">
          <option value="" disabled>Select Shell Type</option>
          <option value="Hard Shell">Hard Shell</option>
          <option value="Soft Shell">Soft Shell</option>
        </select>
        <br /><br />

        <select {...register("numWheels")} defaultValue="">
          <option value="" disabled>Number of Wheels</option>
          <option value="2-Wheels">2 Wheels</option>
          <option value="4-Wheels (Spinner)">4 Wheels (Spinner)</option>
        </select>
        <br /><br />

        <select {...register("lockType")} defaultValue="">
          <option value="" disabled>Lock Type</option>
          <option value="Zipper Lock">Zipper Lock</option>
          <option value="TSA Lock">TSA Lock</option>
          <option value="Combination Lock">Combination Lock</option>
        </select>
        <br /><br />

        {/* Features Checkboxes */}
        <fieldset>
          <legend>Features</legend>
          {suitcaseFeatures.map(feature => (
            <label key={feature}>
              <input type="checkbox" value={feature} {...register("features")} />
              {feature}
            </label>
          ))}
        </fieldset>
        <br /><br />
        <br />

        <input {...register("price", { required: "Price is required", valueAsNumber: true })} placeholder="Price" type="number" />
        <br /><br />
        <br />

        <input {...register("discount", { valueAsNumber: true })} placeholder="Discount (%)" type="number" />
        <br /><br />


        {/* Variants Section */}
        <fieldset>
          <legend>Variant</legend>
          <label>Select Sizes:</label>
          <div className="flex gap-4 mt-2">
            {suitcaseSizes.map((size) => (
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

export default AddSuitcases;