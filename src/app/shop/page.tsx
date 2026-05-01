import { getAllProducts, ShopifyProduct } from "@/lib/shopify";
import ShopClient from "./ShopClient";

export const revalidate = 60;

export default async function ShopPage() {
  let products: ShopifyProduct[] = [];
  let shopifyError: string | null = null;
  try {
    products = await getAllProducts();
  } catch (err) {
    shopifyError = err instanceof Error ? err.message : String(err);
    console.error("[RCBM] Shopify error:", shopifyError);
  }

  return (
    <>
      {shopifyError && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-900 text-white text-xs p-3 font-mono break-all">
          SHOPIFY ERROR: {shopifyError}
        </div>
      )}
      <ShopClient products={products} />
    </>
  );
}
