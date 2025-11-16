import React from "react";
import { useSearchParams } from "react-router-dom";
import templates_Links from "@/utils/templateLinks/TemplateLinks.ts";
import { useForm } from "react-hook-form";
import { BASE_URL } from "@/config/apiConfig.ts";
import * as XLSX from 'xlsx';
import product_Sheet_Validator from "@/utils/products/productSheetValidation";
import filter_Maps from "@/utils/products/filterMap";

function AddInBulk() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const path_category = category?.trim().toLowerCase().replace(/\s+/g, '-');
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
      const sheetLink = templates_Links.csvTemplateLinks[slug];
      if (sheetLink) {
        window.open(sheetLink, "_blank");
      } else {
        alert("Template link not found for this category.");
      }
    }
  };

  const downloadExcelTemplate = () => {
    if (category) {
      const slug = category.toLowerCase().replace(/\s+/g, "");
      const downloadLink = templates_Links.excelTemplateLinks[slug]; // ✅ corrected spelling

      if (downloadLink) {
        // ✅ Use anchor trick for direct download
        const anchor = document.createElement("a");
        anchor.href = downloadLink;
        anchor.download = ""; // optional: force download
        anchor.target = "_blank"; // optional: open in new tab
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      } else {
        alert("Template link not found for this category.");
      }
    }
  };

  const parseXLSX = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        resolve(json);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const csvUpload = async (images: File[], sheet: File) => {

    const formData = new FormData();
    formData.append("sheet", sheet);
    images.forEach((img) => formData.append("images", img));


    if (sellerID && category) {

      formData.append("sellerID", sellerID);
      formData.append("collection", category);


      if (category != "Bags" && category != "Suitcases" && category != "Luggages") {

        const withoutSpaceCategoy = category.replace(/\s+/g, "");


        formData.append("gender", filter_Maps.categoryGenderMap[withoutSpaceCategoy]);

      }


    }


    try {
      const res = await fetch(`${BASE_URL}/api/addProduct/${path_category}/bulk/csv`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      const { success = [], failed = [] } = result;

      const message =
        failed.length === 0
          ? "✅ Bulk upload completed successfully!"
          : success.length === 0
            ? "❌ Bulk upload failed completely."
            : "⚠️ Bulk upload completed with partial success";

      const details =
        failed.length > 0
          ? "\nFailed items:\n" + failed.join("\n")
          : "";

      alert(`${message}${details || "\nAll items uploaded successfully!"}`);
      reset();

    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }

  }

  const excelUpload = async (images: File[], sheet: File) => {
    const parsedData = await parseXLSX(sheet);


    const cleanedData = parsedData.map((row) => {
      const cleanedRow: Record<string, any> = {};

      for (const key in row) {
        const cleanKey = key.split(" ").join("");

        let value = row[key];

        if (cleanKey.toLowerCase() === "features" && typeof value === "string") {
          value = value.split(",").map((f) => f.trim());
        }

        cleanedRow[cleanKey] = value;
      }

      return cleanedRow;
    });

    const { validProducts, failedUploads } = product_Sheet_Validator.excelSheetValidation(cleanedData, images);

    const typedValidProducts: any[] = validProducts;
    const typedFailedUploads: string[] = failedUploads;

    if (validProducts.length == 0) {
      const errMessage = "❌ Bulk upload failed completely.";
      const errDetails = failedUploads.join("\n");

      reset();
      alert(`${errMessage}\n${errDetails}`);
      return;
    }

    const formData = new FormData();

    if (sellerID && category) {

      formData.append("sellerID", sellerID);
      formData.append("collection", category);


      if (category != "Bags" && category != "Suitcases" && category != "Luggages") {

        const withoutSpaceCategoy = category.replace(/\s+/g, "");


        formData.append("gender", filter_Maps.categoryGenderMap[withoutSpaceCategoy]);

        if (filter_Maps.miniCategoryMap[withoutSpaceCategoy]) {
          validProducts.map((product) => {
            if (product.Category) {
              product.Category = filter_Maps.miniCategoryMap[withoutSpaceCategoy]
            }
          });
        }

      }


    }

    if (typedFailedUploads.length > 0) {
      formData.append("failedUploadsFromClient", JSON.stringify(typedFailedUploads));
    }

    formData.append("products", JSON.stringify(typedValidProducts));

    images.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(`${BASE_URL}/api/addProduct/${path_category}/bulk/xlsx`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      const { success = [], failed = [] } = result;

      const message =
        failed.length === 0
          ? "✅ Bulk upload completed successfully!"
          : success.length === 0
            ? "❌ Bulk upload failed completely."
            : "⚠️ Bulk upload completed with partial success";

      const details =
        failed.length > 0
          ? failed.join("\n")
          : "";

      reset();

      alert(`${success}\n${message}\n${details || "\nAll items uploaded successfully!"}`);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed.");
    }

  }

  const onSubmit = async (data: any) => {
    const sheetFile = data.sheet?.[0];
    const fileType = sheetFile?.type;

    const imageFiles = Array.from(data.images || []) as File[];


    if (!sheetFile || !imageFiles || imageFiles.length === 0) {
      alert("Please select both sheet and images.");
      return;
    }
    if (fileType === "text/csv") {
      csvUpload(imageFiles, sheetFile);
    } else if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      excelUpload(imageFiles, sheetFile);
    } else {
      alert("Unknown File Type");
      return;
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
          <button type="button" onClick={downloadExcelTemplate}>
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
