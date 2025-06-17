import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create Order
export async function createOrder(data) {
  return await prisma.saleOrder.create({
    data: {
      customer: {
        connect: { phone: data.customerPhone } // Reference by unique phone
      },
      price: data.price,
      notes: data.notes
    },
    include: {
      customer: true // Return full customer data
    }
  });
}

// Get Orders by Customer Phone
export async function getOrdersByCustomer(phone) {
  return await prisma.saleOrder.findMany({
    where: {
      customer: { phone }
    },
    include: {
      customer: true
    }
  });
}