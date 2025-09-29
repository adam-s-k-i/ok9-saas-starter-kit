import React from 'react'
import { BarChart3 } from 'lucide-react'

export interface ChartComponentProps {
  data?: Array<{ label: string; value: number }>
  title?: string
}

// Example chart component that might be heavy and benefit from lazy loading
export default function ChartComponent({
  data = [
    { label: 'Jan', value: 400 },
    { label: 'Feb', value: 300 },
    { label: 'Mar', value: 200 },
    { label: 'Apr', value: 278 },
    { label: 'May', value: 189 },
  ],
  title = 'Sample Chart'
}: ChartComponentProps) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100

          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-12 text-sm font-medium">{item.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <div
                  className="bg-blue-500 h-6 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {item.value}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}