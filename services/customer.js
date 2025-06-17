import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create Customer
export async function createCustomer(data) {
  return await prisma.customer.create({
    data: {
      phone: data.phone,
      name: data.name,
      email: data.email,
      address: data.address
    }
  });
}

// Get Customer by Phone
export async function getCustomerByPhone(phone) {
  return await prisma.customer.findUnique({
    where: { phone }
  });
}
export async function listCustomers({
  searchTerm = '',
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc'
} = {}) {
  const searchFilter = searchTerm 
    ? {
        OR: [
          { name: { contains: searchTerm } },
          { phone: { contains: searchTerm } },
          { email: { contains: searchTerm } }
        ]
      }
    : {};

  return await prisma.customer.findMany({
    where: searchFilter,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });
}