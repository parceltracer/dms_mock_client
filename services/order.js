import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function listOrders() {
  return await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createOrderFromWebhook(data) {
  return await prisma.order.create({
    data: {
      order_id: data.order_id,
      delivery_state: data.delivery_state || 'CREATED',
      payment_state: data.payment_state || 'UNPAID'
    }
  });
}

export async function createOrUpdateOrder(webhookData) {
    const customer = webhookData.customer;
    const location = webhookData.customer_location.area;

    return await prisma.order.upsert({
      where: { order_id: webhookData.order_id },
      create: {
        order_id: webhookData.order_id,
        customer_name: customer.name,
        customer_phone: customer.phone_number,
        workflow: webhookData.workflow,
        payment_state: webhookData.payment_state,
        delivery_state: webhookData.delivery_state,
        tracking_link: webhookData.tracking_link,
        area_name: location.name_en,
        area_district: location.district,
        coordinates: `${location.lat},${location.long}`,
        number_of_packages: webhookData.number_of_packages,
        notes: webhookData.notes,
        last_updated_at: new Date(),
      },
      update: {
        customer_name: customer.name,
        customer_phone: customer.phone_number,
        workflow: webhookData.workflow,
        payment_state: webhookData.payment_state,
        delivery_state: webhookData.delivery_state,
        tracking_link: webhookData.tracking_link,
        area_name: location.name_en,
        area_district: location.district,
        coordinates: `${location.lat},${location.long}`,
        number_of_packages: webhookData.number_of_packages,
        notes: webhookData.notes,
        last_updated_at: new Date(),
        updatedAt: new Date()
      }
    });
}