import { getAllProducts, ShopifyProduct } from "@/lib/shopify";
import ShopClient from "./ShopClient";

export const revalidate = 60;

export default async function ShopPage() {
  let products: ShopifyProduct[] = [];
  try {
    products = await getAllProducts();
  } catch {
    // Shopify not connected — show placeholder UI
  }

  return <ShopClient products={products} />;
}
