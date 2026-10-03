import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { CHART_COLORS } from '@/shared/constants'
import type { NamedValue } from '@/shared/types'
import { Empty } from './ui'

type Row = object

const hasData = (data: Row[] | undefined | null) =>
  Array.isArray(data) && data.some((d) => Object.values(d).some((v) => typeof v === 'number' && v > 0))

export function BarsChart({ data, dataKey = 'value', horizontal = false, color = CHART_COLORS[0], seriesName = 'Cantidad' }: { data: Row[]; dataKey?: string; horizontal?: boolean; color?: string; seriesName?: string }) {
  if (!hasData(data)) return <Empty />
  return (
    <div className="chart-box">
      <ResponsiveContainer>
        <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ left: horizontal ? 20 : 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={!horizontal} horizontal={horizontal ? false : true} />
          {horizontal ? (
            <>
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
            </>
          )}
          <Tooltip />
          <Bar dataKey={dataKey} name={seriesName} fill={color} radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DonutChart({ data }: { data: NamedValue[] }) {
  if (!hasData(data)) return <Empty />
  return (
    <div className="chart-box">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MultiLineChart({ data, keys }: { data: Row[]; keys: string[] }) {
  if (!data?.length) return <Empty />
  return (
    <div className="chart-box">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={CHART_COLORS[i]} strokeWidth={2.5} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function GroupedBars({ data, keys, labels = {} }: { data: Row[]; keys: string[]; labels?: Record<string, string> }) {
  if (!data?.length) return <Empty />
  return (
    <div className="chart-box">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} name={labels[k] ?? k} fill={CHART_COLORS[i]} radius={4} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
