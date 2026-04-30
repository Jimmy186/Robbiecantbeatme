import { getProductByHandle } from "@/lib/shopify";
import ProductClient from "./ProductClient";

export const revalidate = 60;

export const metadata = {
  title: "ROBBIE CAN'T BEAT ME — Tee | Limited Drop",
  description: "The shirt that says everything. Premium heavyweight tee. Limited quantities.",
};

export default async function ProductPage() {
  let product = null;
  try {
    product = await getProductByHandle("robbie-cant-beat-me-tee");
  } catch {
    // Shopify not connected yet — show placeholder UI
  }

  return <ProductClient product={product} />;
}
