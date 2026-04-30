import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function WeatherTooltip({ active, payload, label, unit = '°C' }) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const dataPoint = payload[0].payload;

  return (
    <div className="rounded-[1.5rem] border border-gray-200 bg-white/80 px-4 py-3 text-sm text-gray-900 shadow-[0_24px_80px_rgba(255,165,0,0.24)] backdrop-blur-2xl">
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-gray-900">
        {dataPoint.temp}
        <span className="text-gray-600">{unit}</span>
      </p>
      {dataPoint.description ? (
        <p className="mt-1 text-xs text-gray-600">{dataPoint.description}</p>
      ) : null}
    </div>
  );
}

export default function WeatherChart({ data = [], unit = '°C' }) {
  return (
    <section className="rounded-[2rem] border border-gray-200 bg-white/60 p-5 shadow-[0_24px_80px_rgba(255,165,0,0.18)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Hourly Trend</p>
          <h2 className="mt-1 text-lg font-semibold text-gray-900">Temperature Forecast</h2>
        </div>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs uppercase tracking-[0.35em] text-gray-700">
          {unit}
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="weatherGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFA500" stopOpacity={0.75} />
                <stop offset="100%" stopColor="#FFD700" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => value}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<WeatherTooltip unit={unit} />} cursor={false} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#FFA500"
              strokeWidth={3}
              fill="url(#weatherGradient)"
              activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2, fill: '#FFA500' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
