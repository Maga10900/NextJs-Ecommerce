export function getOrdersKey(): string {
  if (typeof window === 'undefined') return 'orders_guest';
  const userId = localStorage.getItem('current_user_id');
  return userId ? `orders_${userId}` : 'orders_guest';
}

export function getOrders(): any[] {
  if (typeof window === 'undefined') return [];
  const key = getOrdersKey();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: any): void {
  if (typeof window === 'undefined') return;
  const orders = getOrders();
  orders.push({
    ...order,
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString(),
  });
  localStorage.setItem(getOrdersKey(), JSON.stringify(orders));
}
