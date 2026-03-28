import { CartItem, OrderFormData } from '@/types';
import { formatPrice } from './utils';

export function buildWhatsAppLink(
  items: CartItem[],
  customer: OrderFormData,
  orderNumber: string,
  subtotal: number
): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

  let message = `🛍️ *New Order - ${orderNumber}*\n\n`;
  message += `👤 *Customer:* ${customer.firstName} ${customer.lastName}\n`;
  message += `📞 ${customer.phone}\n`;
  message += `📧 ${customer.email}\n`;
  message += `📍 ${customer.address}, ${customer.city}\n\n`;
  message += `📦 *Items:*\n`;

  items.forEach((item, i) => {
    message += `${i + 1}. ${item.product.name.en} - ${item.selectedSize}/${item.selectedColor} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}\n`;
  });

  message += `\n💰 *Total: ${formatPrice(subtotal)}*\n`;

  if (customer.notes) {
    message += `\n📝 *Notes:* ${customer.notes}`;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
