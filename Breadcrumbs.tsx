import { Link } from '@/lib/router';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface Crumb { label: string; to?: string }

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <nav className={`flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-400 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <Link to="/" className="hover:text-ink-900 transition-colors">Home</Link>
      {crumbs.map(c => (
        <span key={c.label} className="flex items-center gap-2">
          <ChevronRight className="w-3 h-3" />
          {c.to ? <Link to={c.to} className="hover:text-ink-900 transition-colors">{c.label}</Link> : <span className="text-ink-700">{c.label}</span>}
        </span>
      ))}
    </nav>
  );
}
