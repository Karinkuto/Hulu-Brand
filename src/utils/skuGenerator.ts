// @ts-nocheck
export function generateSKU(product: { category: string; name: string }, variant: { size: string }): string {
  const categoryCode = product.category.slice(0, 3).toUpperCase();
  const nameCode = product.name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  const sizeCode = variant.size.toUpperCase();
  const uniqueId = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${categoryCode}-${nameCode}-${sizeCode}-${uniqueId}`;
}