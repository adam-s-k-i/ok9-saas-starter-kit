import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test users
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b9a3fb52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'premium@example.com' },
    update: {},
    create: {
      email: 'premium@example.com',
      name: 'Premium User',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80',
    },
  })

  // Create subscriptions
  await prisma.subscription.upsert({
    where: { userId: user3.id },
    update: {},
    create: {
      userId: user3.id,
      status: 'active',
      priceId: 'price_test_premium',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      cancelAtPeriodEnd: false,
    },
  })

  // Create some invoices
  await prisma.invoice.create({
    data: {
      userId: user3.id,
      amount: 2900, // $29.00 in cents
      currency: 'usd',
      status: 'paid',
      paidAt: new Date(),
    },
  })

  await prisma.invoice.create({
    data: {
      userId: user2.id,
      amount: 900, // $9.00 in cents
      currency: 'usd',
      status: 'pending',
    },
  })

  // Create API keys
  await prisma.apiKey.create({
    data: {
      userId: user3.id,
      name: 'Production API Key',
      key: 'sk_live_test_key_' + Math.random().toString(36).substring(2, 15),
      lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000), // Used yesterday
    },
  })

  await prisma.apiKey.create({
    data: {
      userId: user1.id,
      name: 'Development API Key',
      key: 'sk_dev_test_key_' + Math.random().toString(36).substring(2, 15),
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000), // Used 2 hours ago
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created users:`)
  console.log(`   - ${user1.name} (${user1.email})`)
  console.log(`   - ${user2.name} (${user2.email})`)
  console.log(`   - ${user3.name} (${user3.email}) - Premium subscriber`)
  console.log(`💳 Created 1 active subscription`)
  console.log(`📄 Created 2 invoices (1 paid, 1 pending)`)
  console.log(`🔑 Created 2 API keys`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })