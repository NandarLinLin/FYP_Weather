import { CloudSun } from 'lucide-react';

export default function WeatherCard({
  city = 'Unknown City',
  temperature = '--',
  unit = '°C',
  description = 'Clear skies',
  icon: Icon = CloudSun,
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white/60 p-8 shadow-[0_30px_80px_rgba(255,165,0,0.25)] backdrop-blur-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-yellow-50/10 to-white" />
      <div className="relative flex flex-col gap-8">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-gray-500">Current Weather</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            {city}
          </h1>
        </div>

        <div className="grid items-center gap-8 sm:grid-cols-[auto_auto]">
          <div className="rounded-[1.75rem] border border-gray-200 bg-orange-50 p-6 text-orange-600 shadow-[0_15px_35px_rgba(255,165,0,0.35)]">
            <Icon size={56} className="text-orange-500" />
          </div>

          <div className="space-y-3">
            <p className="text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              {temperature}
              <span className="text-3xl font-medium text-gray-600">{unit}</span>
            </p>
            <p className="text-base text-gray-700">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
