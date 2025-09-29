import React from 'react'

export interface HeavyComponentProps {
  title?: string
  data?: string[]
}

// Example heavy component that might benefit from lazy loading
export default function HeavyComponent({
  title = 'Heavy Component',
  data = []
}: HeavyComponentProps) {
  // Simulate expensive computation
  const expensiveData = React.useMemo(() => {
    return data.map(item => ({
      id: Math.random().toString(36),
      value: item,
      processed: item.toUpperCase(),
    }))
  }, [data])

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {expensiveData.map(item => (
          <div key={item.id} className="p-2 bg-gray-50 rounded">
            {item.processed}
          </div>
        ))}
      </div>
    </div>
  )
}