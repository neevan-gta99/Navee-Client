import { useAppSelector } from '@/redux/hooks';
import type { RootState } from '@/redux/store/store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

function AddMenBottomwear() {

  const bottomwearSubcategories = ["Jeans", "Trousers", "Shorts", "Joggers", "Track Pants", "Pyjamas"];
  const bottomwearMaterials = ["Cotton", "Denim", "Linen", "Polyester", "Wool", "Blended Fabric", "Khaki"];
  const bottomwearFits = ["Regular Fit", "Slim Fit", "Relaxed Fit", "Skinny Fit", "Tapered Fit"];
  const bottomwearWaistRise = ["Mid-Rise", "Low-Rise", "High-Rise"];
  const bottomwearSizes = ["28", "30", "32", "34", "36", "38", "40", "42", "44"];
  const bottomwearColors = [
    "White", "Black", "Navy Blue", "Gray", "Charcoal", "Red", "Blue", "Green",
    "Yellow", "Pink", "Purple", "Brown", "Beige", "Khaki", "Maroon", "Olive", "Teal", "Cream", "Multi-color"
  ];

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
      bottomwearColors.forEach((color) => {
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

      bottomwearColors.forEach((color) => {
        const isChecked = getValues(`variant.${size}.${color}.selected`);
        const stock = getValues(`variant.${size}.${color}.stock`);

        if (isChecked) {
          const numericStock = Number(stock) || 0;
          
          groupedVariants[size].variants.push({ color, stock: numericStock });
        }
      });
    });

    
    const variants = Object.values(groupedVariants);

    const formData = new FormData();

    Object.entries({
      ...data,
      sellerID: sellerID,
      gender: "Male",
      collection: category,
      totalStock: totalStock
    }).forEach(([key, value]) => {
      if (key === "variant") {
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
      files.forEach((file) => {
        formData.append("images", file);
      });
      formData.append("collection", "Men Bottomwear");
    } else {
      alert("Please select at least one image.");
      return;
    }

    try {
      const response = await fetch("http://localhost:6173/api/addProduct/men-bottomwear", {
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
      <h1 className='mt-20'>Add Men's Bottomwear</h1>
      <br /><br />

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name", { required: "Name is required" })} placeholder="Product Name" type="text" />
        <br /><br />
        <br />

        <input {...register("brand", { required: "Brand is required" })} placeholder="Brand Name" type="text" />
        <br /><br />
        <br />

        <input {...register("category")} value={category ?? ""} readOnly type="text" />
        <br /><br />

        <select {...register("subCategory", { required: "Sub-category is required" })} defaultValue="">
          <option value="" disabled>Select Sub-category</option>
          {bottomwearSubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
        <br /><br />
        <br />

        <input {...register("price", { required: "Price is required", valueAsNumber: true })} placeholder="Price" type="number" />
        <br /><br />
        <br />

        <input {...register("discount", { valueAsNumber: true })} placeholder="Discount (%)" type="number" />
        <br /><br />

        <select {...register("material", { required: "Material is required" })} defaultValue="">
          <option value="" disabled>Select Material</option>
          {bottomwearMaterials.map(material => <option key={material} value={material.toLowerCase()}>{material}</option>)}
        </select>
        <br /><br />
        <br />

        <select {...register("fit", { required: "Fit type is required" })} defaultValue="">
          <option value="" disabled>Choose Fit Type</option>
          {bottomwearFits.map(fit => <option key={fit} value={fit.split(" ")[0].toLowerCase()}>{fit}</option>)}
        </select>
        <br /><br />
        <br />

        <select {...register("waistRise", { required: "Waist Rise is required" })} defaultValue="">
          <option value="" disabled>Choose Waist Rise</option>
          {bottomwearWaistRise.map(rise => <option key={rise} value={rise.toLowerCase().replace('-', '')}>{rise}</option>)}
        </select>
        <br /><br />

        <fieldset>
          <legend>Variant</legend>
          <label>Select Sizes:</label>
          <div className="flex gap-4 mt-2">
            {bottomwearSizes.map((size) => (
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
                {bottomwearColors.map((color) => {
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
        <input
key="file-input" // Static key}
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

export default AddMenBottomwear;