import { Sun } from 'lucide-react';

export default function ForecastCard({
  day = 'Mon',
  icon: Icon = Sun,
  highTemp = '--',
  lowTemp = '--',
  precipitation = null,
}) {
  return (
    <article className="rounded-3xl border border-gray-200 bg-white/70 p-5 text-gray-900 shadow-[0_16px_40px_rgba(255,165,0,0.18)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:bg-orange-50">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.3em] text-gray-500">{day}</p>
        <Icon size={28} className="text-orange-500" />
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-2xl font-semibold text-gray-900">{highTemp}</p>
          <p className="text-sm text-gray-600">High</p>
        </div>

        <div className="text-right">
          <p className="text-lg font-medium text-gray-700">{lowTemp}</p>
          <p className="text-sm text-gray-500">Low</p>
        </div>
      </div>

      {precipitation !== null ? (
        <div className="mt-5 rounded-2xl bg-orange-100 px-3 py-2 text-sm text-gray-700">
          Precipitation: {precipitation}%
        </div>
      ) : null}
    </article>
  );
}
