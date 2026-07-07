import blogs from '../../app/(homepage)/blogs/data/blogs.json';
import { CountUp } from './motion/count-up';
import { Reveal } from './motion/reveal';

// Headline numbers. Blog count is derived; the rest are stable constants.
const stats = [
  { value: 5, suffix: '+', label: 'UI Components' },
  { value: 9, suffix: '', label: 'Form Challenges' },
  { value: blogs.length, suffix: '', label: 'Blog Posts' },
  { value: 100, suffix: '%', label: 'Open Source' },
];

export function StatsSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1} className="text-center">
              <p className="bg-linear-to-br from-emerald-500 to-teal-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
