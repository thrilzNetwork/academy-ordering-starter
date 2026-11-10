import products from "../data/products.json";

// Los productos viven en un archivo. Más adelante podrías moverlos a la base de datos.
export function allProducts() {
  return products;
}

export function findProduct(id) {
  return products.find((p) => p.id === id) || null;
}

export function money(amount, currency = "S/") {
  return `${currency} ${Number(amount).toFixed(2)}`;
}
