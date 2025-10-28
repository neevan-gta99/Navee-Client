import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import type { RootState } from "@/redux/store/store";
import { useAppSelector } from '@/redux/hooks';
import { BASE_URL } from '@/config/apiConfig.ts';


function AddBags() {

  const bagBrands = ["Samsonite", "American Tourister", "Skybags", "Wildcraft", "F Gear", "Puma", "Adidas"];
  const bagSubcategories = ["Backpack", "Duffel Bag", "Messenger Bag"];
  const bagMaterials = ["Polyester", "Nylon", "Leather", "Canvas"];
  const bagSizes = ["Small", "Medium", "Large"];
  const bagFeatures = ["Water-resistant", "Laptop Compartment", "Adjustable Straps", "Padded Back"];
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
      const response = await fetch(`${BASE_URL}/addProduct/bags`, {
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
      <h1 className='mt-20'>Add Bags & Backpacks</h1>
      <br /><br />

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name", { required: "Product Name is required" })} placeholder="Product Name" type="text" />
        <br /><br />
        <br />

        <select {...register("brand", { required: "Brand is required" })} defaultValue="">
          <option value="" disabled>Select Brand</option>
          {bagBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
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

        <select {...register("subCategory", { required: "Sub-category is required" })} defaultValue="">
          <option value="" disabled>Select Bag Type</option>
          {bagSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
        <br /><br />
        <br />

        <input {...register("capacity", { required: "Capacity is required", valueAsNumber: true })} placeholder="Capacity (in Litres)" type="number" />
        <br /><br />
        <br />

        <select {...register("material")} defaultValue="">
          <option value="" disabled>Select Material</option>
          {bagMaterials.map(material => <option key={material} value={material}>{material}</option>)}
        </select>
        <br /><br />

        <fieldset>
          <legend>Features</legend>
          {bagFeatures.map(feature => (
            <label key={feature}>
              <input type="checkbox" value={feature} {...register("features")} />
              {feature}
            </label>
          ))}
        </fieldset>
        <br /><br />

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
            {bagSizes.map((size) => (
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

export default AddBags;
