// Client-safe exports (can be used in client components)
export const PLANS = {
  basic: {
    name: 'Basic',
    description: 'Perfect for getting started',
    price: 990, // $9.90
    features: [
      '10 Projects',
      'Basic Analytics',
      'Email Support',
    ],
  },
  pro: {
    name: 'Professional',
    description: 'For growing businesses',
    price: 2990, // $29.90
    features: [
      'Unlimited Projects',
      'Advanced Analytics',
      'Priority Support',
      'API Access',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 9990, // $99.90
    features: [
      'Everything in Pro',
      'Custom Integrations',
      'Dedicated Account Manager',
      'SLA Guarantee',
    ],
  },
}