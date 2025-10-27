import { useAppSelector } from '@/redux/hooks';
import type { RootState } from '@/redux/store/store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

function AddWomensWA() {

  const watchCategories = ["Analog", "Digital", "Chronograph", "Smartwatch"];
  const accessorySubcategories = ["Handbag", "Wallet", "Scarf", "Sunglasses", "Jewellery"];
  const watchBrands = ["Fossil", "Titan", "Michael Kors", "Casio", "Rolex", "Tissot", "Guess", "Fastrack"];
  const accessoryBrands = ["Lino Perros", "Baggit", "Lavie", "Hidesign", "Caprese", "Aldo"];
  const accessorySizes = ["Small", "Medium", "Large", "One Size"]; // General sizes for accessories like handbags/scarves
  const accessoryMaterials = ["Leather", "Synthetic Leather", "Fabric", "Metal", "Plastic", "Polycarbonate"];

  const colors = ["Black", "Brown", "White", "Tan", "Pink", "Gray"];


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

    if (selectedSizes.length > 0) {
      selectedSizes.forEach((size) => {
        colors.forEach((color) => {
          const variant = variants?.[size]?.[color];
          if (variant?.selected && variant.stock !== undefined) {
            total += Number(variant.stock) || 0;
          }
        });
      });
    } else {
      const oneSize = "oneSize";
      colors.forEach((color) => {
        const variant = variants?.[oneSize]?.[color];
        if (variant?.selected && variant.stock !== undefined) {
          total += Number(variant.stock) || 0;
        }
      });
    }

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

  const product_Type = watch("productType");

  const onSubmit = async (data: any) => {

    const groupedVariants: { [size: string]: { size: string, variants: { color: string, stock: number }[] } } = {};

    if (selectedSizes.length > 0) {
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
    } else {
      // Logic for one-size products (e.g., watches)
      groupedVariants["oneSize"] = {
        size: "oneSize",
        variants: [],
      };
      colors.forEach((color) => {
        const isChecked = getValues(`variant.oneSize.${color}.selected`);
        const stock = getValues(`variant.oneSize.${color}.stock`);
        if (isChecked) {
          const numericStock = Number(stock) || 0;
          groupedVariants["oneSize"].variants.push({ color, stock: numericStock });
        }
      });
    }

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
      const response = await fetch("http://localhost:6173/api/addProduct/womens-wa", {
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
      <h1 className='mt-20'>Add Women's Watches & Accessories</h1>
      <br /><br />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Info */}
        <input {...register("name", { required: "Product Name is required" })} placeholder="Product Name" type="text" />
        <br /><br />

        <input {...register("category", { required: "Category is required" })} placeholder={category ?? ""} value="Women WA" readOnly type="text" />
        <br /><br />

        {/* Dynamic Category Selection */}
        <select {...register("productType", { required: true })} defaultValue="">
          <option value="" disabled>Select Category</option>
          <option value="Watches">Watches</option>
          <option value="Accessories">Accessories</option>
        </select>
        <br /><br />

        {/* Dynamic Brand Selection */}
        {product_Type === "Watches" && (
          <>
            <select {...register("brand", { required: "Brand is required" })} defaultValue="">
              <option value="" disabled>Select Brand</option>
              {watchBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
            <br /><br />
          </>
        )}
        {product_Type === "Accessories" && (
          <>
            <select {...register("brand", { required: "Brand is required" })} defaultValue="">
              <option value="" disabled>Select Brand</option>
              {accessoryBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
            <br /><br />
          </>
        )}

        {/* Dynamic fields for Watches */}
        {product_Type === "Watches" && (
          <>
            <select {...register("subCategory", { required: true })} defaultValue="">
              <option value="" disabled>Select Type</option>
              {watchCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <br /><br />
            <select {...register("dialShape")} defaultValue="">
              <option value="" disabled>Select Dial Shape</option>
              <option value="Round">Round</option>
              <option value="Square">Square</option>
              <option value="Rectangular">Rectangular</option>
              <option value="Oval">Oval</option>
            </select>
            <br /><br />
            <select {...register("strapMaterial")} defaultValue="">
              <option value="" disabled>Select Strap Material</option>
              <option value="Leather">Leather</option>
              <option value="Metal">Metal</option>
              <option value="Silicone">Silicone</option>
              <option value="Fabric">Fabric</option>
            </select>
            <br /><br />
            <select {...register("movement")} defaultValue="">
              <option value="" disabled>Select Movement</option>
              <option value="Quartz">Quartz</option>
              <option value="Automatic">Automatic</option>
              <option value="Smartwatch">Smartwatch</option>
            </select>
            <br /><br />
          </>
        )}

        {/* Dynamic fields for Accessories */}
        {product_Type === "Accessories" && (
          <>
            <select {...register("subCategory", { required: true })} defaultValue="">
              <option value="" disabled>Select Subcategory</option>
              {accessorySubcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <br /><br />
            <select {...register("material", { required: "Material is required" })} defaultValue="">
              <option value="" disabled>Select Material</option>
              {accessoryMaterials.map(mat => <option key={mat} value={mat}>{mat}</option>)}
            </select>
            <br /><br />
          </>
        )}

        {/* Common Fields */}
        <input {...register("price", { required: "Price is required", valueAsNumber: true })} placeholder="Price" type="number" />
        <br /><br />

        <input {...register("discount", { valueAsNumber: true })} placeholder="Discount (%)" type="number" />
        <br /><br />

        {/* Variants */}
        <fieldset>
          <legend>Variant</legend>

          {/* Sizes for Accessories (Belts) */}
          {product_Type === "Accessories" && (
            <>
              <label>Select Sizes:</label>
              <div className="flex gap-4 mt-2 mb-4">
                {accessorySizes.map((size) => (
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
            </>
          )}

          {/* Colors and Stock for all cases */}
          {selectedSizes.length > 0 ? (
            // If sizes are selected (e.g., for belts)
            selectedSizes.map((size) => (
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
            ))
          ) : (
            // If no sizes are selected (e.g., for watches or accessories without size)
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                {colors.map((color) => {
                  const isChecked = watchedVariant?.["oneSize"]?.[color]?.selected;
                  const key = `oneSize-${color}`;
                  return (
                    <div key={color} className="flex items-center gap-4">
                      <label>
                        <input
                          type="checkbox"
                          {...register(`variant.oneSize.${color}.selected`, {
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
                        {...register(`variant.oneSize.${color}.stock`, {
                          valueAsNumber: true,
                          required: isChecked ? "Stock is required." : false,
                          min: { value: 1, message: "Minimum stock is 1." },
                          onChange: (e) => {
                            const newValue = Number(e.target.value) || 0;
                            setValue(`variant.oneSize.${color}.stock`, newValue);
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
          )}

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

export default AddWomensWA;