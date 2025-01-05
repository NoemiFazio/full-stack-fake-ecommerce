import db from "@/db/db";
import PageHeader from "@/app/admin/_components/PageHeader";
import ProductForm from "@/app/admin/products/_components/ProductForm";

export default async function editProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </>
  );
}
