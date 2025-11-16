interface Variant {
  color: string;
  stock: number;
}

interface SizeVariant {
  size: string;
  variants: Variant[];
}

interface Product {
  Sizes: string;
  variants?: SizeVariant[];
  totalStock?: number;
  name?: string; // optional for error reporting
}

const sizeVariantsRegex = (sizeBlocks: string[]) => {
  for (const block of sizeBlocks) {
    const sizeMatch = block.match(/^(.+?)-/); 
    if (!sizeMatch) return true;

    const colorPairs = block.split("-")[1]?.split("/") || [];
    for (const pair of colorPairs) {
      const [color, stock] = pair.trim().split("=");
      if (!color || isNaN(Number(stock))) return true;
    }
  }
  return false;
};


const parseSizeVariants = (product: Product, allSizes: any[]) => {

  let totalStock = 0;

  const sizeVariants: SizeVariant[] = allSizes.map((sizeBlock) => {
    const [size, ...colorChunks] = sizeBlock.split("-");
    const colorPairs = colorChunks.join("-").split("/");

    const variants: Variant[] = colorPairs.map((pair: any) => {
      const [color, stockStr] = pair.split("=");
      const stock = Number(stockStr);
      const safeStock = isNaN(stock) ? 0 : stock;

      totalStock += safeStock;

      return {
        color: color?.trim() || "Unknown",
        stock: safeStock,
      };
    });

    return {
      size: size.trim(),
      variants
    };
  });

  product.totalStock = totalStock;
  product.variants = sizeVariants;
  
};

export const excelSheetValidation = (products: any[], images: File[]) => {

    let validProducts: any[] = [];
    let failedUploads: string[] = [];

    console.log(products);

    products.forEach((product) => {

        const perProductImages = product.Images?.split(",") || [];
        console.log(perProductImages);
        if (perProductImages.length > 10) {
            failedUploads.push(`Failed: ${product.ProductName} because this product have more than 10 images`);
            return;
        }


        const matchedImages = perProductImages.filter((imgName: any) =>
            images.find((file) => file.name === imgName.trim())
        );

        if(perProductImages.length != matchedImages.length){
            failedUploads.push(`Failed: ${product.ProductName} because this product images name mistached with excel sheet images name or may be images count is more less with excel sheet images`);
            return;
        }
        
        const sizesString = product.Sizes || "";
        const allSizes = sizesString.split(",").map((s: any) => s.trim());
        let malformedBlock = sizeVariantsRegex(allSizes);
        
        if(malformedBlock){
            
            failedUploads.push(`Failed: ${product.ProductName} Invalid Sizes Format Information`);
            return;
        }

        parseSizeVariants(product,allSizes);

        validProducts.push(product);

    })


    return{validProducts,failedUploads};

};


const product_Sheet_Validator = { excelSheetValidation };
export default product_Sheet_Validator;