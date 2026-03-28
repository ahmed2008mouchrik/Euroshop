import emailjs from '@emailjs/browser';
import { CartItem, OrderFormData } from '@/types';
import { formatPrice } from './utils';

export async function sendOrderEmail(
  items: CartItem[],
  customer: OrderFormData,
  orderNumber: string,
  subtotal: number
): Promise<boolean> {
  try {
    const itemsList = items
      .map(
        (item, i) =>
          `${i + 1}. ${item.product.name.en} | Size: ${item.selectedSize} | Color: ${item.selectedColor} | Qty: ${item.quantity} | ${formatPrice(item.product.price * item.quantity)}`
      )
      .join('\n');

    const templateParams = {
      order_number: orderNumber,
      customer_name: `${customer.firstName} ${customer.lastName}`,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_city: customer.city,
      customer_address: customer.address,
      customer_notes: customer.notes || 'None',
      items_list: itemsList,
      subtotal: formatPrice(subtotal),
      item_count: items.reduce((sum, item) => sum + item.quantity, 0).toString(),
    };

    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );

    return true;
  } catch (error) {
    console.error('Failed to send order email:', error);
    return false;
  }
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  try {
    await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID!,
      data,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );
    return true;
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return false;
  }
}
