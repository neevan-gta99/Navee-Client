import React, { useEffect, useState, useRef, useCallback } from 'react'; // Added useRef
import { useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import type { RootState } from "@/redux/store/store";
import { useAppSelector } from '@/redux/hooks';
import { BASE_URL } from '@/config/apiConfig.ts';

function AddMenTopwear() {
    const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
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

        const variants = Object.values(groupedVariants);

        const formData = new FormData();
        Object.entries({
            ...data,
            sellerID: sellerID,
            gender: "Male",
            collection: category,
            totalStock: totalStock,
        }).forEach(([key, value]) => {
            if (key === "variant") return;
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
            // formData.append("collection", "Men Topwear");
        } else {
            alert("Please select at least one image.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/addProduct/men-topwear`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });
            const jsonData = await response.json();
            if (response.ok) {
                alert("Product added successfully!");
                setTotalStock(0);
                reset();
                setFiles([]);
                setSelectedSizes([]);
                setTotalStock(0);
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
            <h1 className='mt-20'>Add Product</h1>
            <br /><br />
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name", { required: "Name is required" })} placeholder="Product Name" type="text" />
                <br /><br />
                <input {...register("brand", { required: "Brand is required" })} placeholder="Brand Name" type="text" />
                <br /><br />
                <input {...register("category", { required: "Category is required" })} value={category ?? ""} readOnly type="text" />
                <br /><br />
                <select {...register("subCategory", { required: "Sub-category is required" })}>
                    <option value="">Select Sub-category</option>
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Polo">Polo</option>
                    <option value="Kurta">Kurta</option>
                    <option value="Hoodie">Hoodie</option>
                    <option value="Sweatshirt">Sweatshirt</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Blazer">Blazer</option>
                    <option value="Tank Top">Tank Top</option>
                    <option value="Sherwani">Sherwani</option>
                    <option value="Nehru Jacket">Nehru Jacket</option>
                    <option value="Co-ord Set">Co-ord Set</option>
                </select>
                <br /><br />
                <input {...register("price", { required: "Price is required", valueAsNumber: true })} placeholder="Price" type="number" />
                <br /><br />
                <input {...register("discount", { valueAsNumber: true })} placeholder="Discount (%)" type="number" />
                <br /><br />
                <select {...register("material", { required: "Material is required" })}>
                    <option value="">Select Material</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Linen">Linen</option>
                    <option value="Silk">Silk</option>
                    <option value="Polyester">Polyester</option>
                    <option value="Nylon">Nylon</option>
                    <option value="Wool">Wool</option>
                    <option value="Denim">Denim</option>
                    <option value="Khadi">Khadi</option>
                    <option value="Leather">Leather</option>
                    <option value="Blend (Mixed)">Blend (Mixed)</option>
                </select>
                <br /><br />
                <select {...register("fit", { required: "Fit type is required" })} defaultValue="">
                    <option value="" disabled>Choose Fit Type</option>
                    <option value="Regular Fit">Regular Fit</option>
                    <option value="Slim Fit">Slim Fit</option>
                    <option value="Relaxed Fit">Relaxed Fit</option>
                    <option value="Athletic Fit">Athletic Fit</option>
                    <option value="Tailored Fit">Tailored Fit</option>
                </select>
                <br /><br />
                <select {...register("sleeve", { required: "Sleeve type is required" })} defaultValue="">
                    <option value="" disabled>Choose Sleeve Type</option>
                    <option value="Half Sleeve">Half Sleeve</option>
                    <option value="Full Sleeve">Full Sleeve</option>
                </select>
                <br /><br />
                <select {...register("neck", { required: "Neck type is required" })} defaultValue="">
                    <option value="" disabled>Choose Neck Type</option>
                    <option value="Round Neck">Round Neck</option>
                    <option value="V Neck">V Neck</option>
                    <option value="Henley Neck">Henley Neck</option>
                </select>
                <br /><br />
                
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
                    <label>Total Stock: {totalStock}</label>

                </fieldset>
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

export default AddMenTopwear;