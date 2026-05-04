import type { ReactNode } from 'react';

// Icons
export {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  FileText,
  Globe,
  LayoutGrid,
  Loader2,
  type LucideIcon,
  Mail,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Share2,
  Trash2,
  Upload,
  Users,
  X,
  Zap,
} from 'lucide-react';
export { Navbar } from './Navbar.js';
export type { DesignTokens } from './tokens.js';
export { designTokens } from './tokens.js';

// Types for component props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

// Simple component implementations
export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: '',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: '',
  };

  const classes = [baseClasses, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = '', title, action }: CardProps) {
  const hasTitle = title !== undefined && title.length > 0;
  const hasAction = action !== undefined && action !== null;
  const hasHeader = hasTitle || hasAction;

  return (
    <div className={`card ${className}`}>
      {hasHeader ? (
        <div className="card-header">
          {hasTitle ? <h3 className="card-title">{title}</h3> : null}
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variantClasses = {
    default: '',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  };

  return <span className={`badge ${variantClasses[variant]}`}>{children}</span>;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={className}>
      {label !== undefined && label.length > 0 ? (
        <label
          style={{
            display: 'block',
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            {label}
          </span>
          <input className="input" {...props} />
        </label>
      ) : (
        <input className="input" {...props} />
      )}
      {error !== undefined && error.length > 0 ? (
        <span
          style={{
            display: 'block',
            fontSize: '0.75rem',
            color: 'var(--accent-error)',
            marginTop: '0.5rem',
          }}
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function ScoreRing({ score, size = 'md' }: ScoreRingProps) {
  const getColor = (s: number) => {
    if (s >= 90) return 'var(--accent-success)';
    if (s >= 50) return 'var(--accent-warning)';
    return 'var(--accent-error)';
  };

  const sizeMap = {
    sm: 48,
    md: 80,
    lg: 120,
  };

  const px = sizeMap[size];

  return (
    <div
      className="score-ring"
      style={{
        width: px,
        height: px,
        ['--score-color' as string]: getColor(score),
        ['--score-value' as string]: score,
      }}
    >
      <span>{Math.round(score)}</span>
    </div>
  );
}

export function MetricCard({ label, value, trend, trendValue }: MetricCardProps) {
  const trendColors = {
    up: 'var(--accent-success)',
    down: 'var(--accent-error)',
    neutral: 'var(--color-text-muted)',
  };
  const hasTrend = trend !== undefined && trendValue !== undefined && trendValue.length > 0;

  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {hasTrend ? (
        <div
          style={{
            fontSize: '0.75rem',
            color: trendColors[trend],
            marginTop: '0.25rem',
          }}
        >
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
        </div>
      ) : null}
    </div>
  );
}

export function AppShell({
  children,
  title,
  actions,
}: {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
}) {
  const hasActions = actions !== undefined && actions !== null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1>{title}</h1>
        </div>
        {hasActions ? <div style={{ display: 'flex', gap: '0.5rem' }}>{actions}</div> : null}
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const hasDescription = description !== undefined && description.length > 0;
  const hasAction = action !== undefined && action !== null;

  return (
    <div className="empty-state">
      <Icon className="empty-state-icon" />
      <h3 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>{title}</h3>
      {hasDescription ? <p style={{ margin: 0, maxWidth: 400 }}>{description}</p> : null}
      {hasAction ? <div style={{ marginTop: '1.5rem' }}>{action}</div> : null}
    </div>
  );
}

export function ProgressBar({
  value,
  max = 100,
  color = 'var(--accent-primary)',
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="progress-bar">
      <div className="progress-bar-fill" style={{ width: `${percentage}%`, background: color }} />
    </div>
  );
}

export function StatusBadge({
  status,
}: {
  status: 'pending' | 'running' | 'completed' | 'failed';
}) {
  const labels = {
    pending: 'Pending',
    running: 'Running',
    completed: 'Completed',
    failed: 'Failed',
  };

  return <span className={`status status-${status}`}>{labels[status]}</span>;
}
