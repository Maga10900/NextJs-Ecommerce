/**
 * Per-user cart helpers.
 * Cart is stored under `cart_<userId>` so each account has its own cart.
 * If the user is not logged in, falls back to `cart_guest`.
 */

export function getCartKey(): string {
  const userId = localStorage.getItem('current_user_id');
  return userId ? `cart_${userId}` : 'cart_guest';
}

export function getCart(): any[] {
  const key = getCartKey();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: any[]): void {
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

export function addToCart(product: { id: number; title: string; price: number; images?: string[] }): any[] {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.title,
      price: product.price,
      img: product.images?.[0]?.replace(/[\[\]"]/g, '') || 'https://via.placeholder.com/300',
      qty: 1,
    });
  }
  saveCart(cart);
  return cart;
}
