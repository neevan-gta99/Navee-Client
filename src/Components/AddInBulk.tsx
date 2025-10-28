import React from "react";
import { useSearchParams } from "react-router-dom";
import { csvTemplateLinks } from "@/utils/csvTemplateLinks";
import { useForm } from "react-hook-form";
import { BASE_URL } from "@/config/apiConfig";

function AddInBulk() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const sellerID = searchParams.get("seller_Id");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const goToCSVTemplate = () => {
    if (category) {
      const slug = category.toLowerCase().replace(/\s+/g, "");
      const sheetLink = csvTemplateLinks[slug];
      if (sheetLink) {
        window.open(sheetLink, "_blank");
      } else {
        alert("Template link not found for this category.");
      }
    }
  };

  const onSubmit = async (data: any) => {
    const sheetFile = data.sheet?.[0];
    const imageFiles = Array.from(data.images || []) as File[];


    if (!sheetFile || !imageFiles || imageFiles.length === 0) {
      alert("Please select both CSV and images.");
      return;
    }

    const formData = new FormData();
    formData.append("sheet", sheetFile);

    imageFiles.forEach((img) => formData.append("images", img));


    if (sellerID) {
      formData.append("sellerID", sellerID);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/addProduct/men-topwear/bulk`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        alert("File upload Unsuccessful:\n" + (result.failed?.join("\n") || result.message || "Unknown error"));
      } else {
        alert("File uploaded successfully!");
      }

      reset();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }
  };

  const selectedSheet = watch("sheet")?.[0];
  const selectedImages = watch("images");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📦 Bulk Product Upload</h1>

      {/* 🧠 CSV Creation Guide */}
      <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <h2 className="font-semibold mb-2">📝 How to Prepare Your CSV/XLSX File</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          <li>Use the template to maintain correct column order.</li>
          <li>Fill product details row by row.</li>
          <li>Ensure image names match the files you upload.</li>
          <li>Do not change column headers.</li>
        </ul>

        <div className="mt-4 flex gap-4">
          <button type="button" onClick={goToCSVTemplate}>
            📄 Open Google Sheet Template
          </button>
          <button type="button" onClick={goToCSVTemplate}>
            📥 Download XLSX Template
          </button>
        </div>
      </div>

      {/* 📁 Upload Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="border p-4 rounded bg-gray-50">
          <label className="block mb-2 font-medium">Upload CSV or XLSX file:</label>
          <input
            type="file"
            accept=".csv,.xlsx"
            {...register("sheet", {
              required: true,
              validate: {
                fileSize: (fileList) =>
                  fileList[0]?.size <= 10 * 1024 * 1024 || "File must be under 10MB",
              },
            })}
            className="mb-4"
          />
          {errors.sheet && <p className="text-red-500 text-sm">CSV file is required</p>}

          {selectedSheet && (
            <p className="mb-2 text-sm text-gray-600">Selected: {selectedSheet.name}</p>
          )}

          <label className="block mb-2 font-medium">Upload product images:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            {...register("images", { required: true })}
          />
          {errors.images && <p className="text-red-500 text-sm">At least one image is required</p>}

          {selectedImages?.length > 0 && (
            <p className="mb-2 text-sm text-gray-600">
              {selectedImages.length} image selected
            </p>
          )}

          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            🚀 Upload File
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddInBulk;
