import { motion } from 'framer-motion';
import { getHealthColor } from '@/lib/healthUtils';

interface HealthRingProps {
  score: number;
  size?: number;
  showLabel?: boolean;
  strokeWidth?: number;
}

export function HealthRing({ score, size = 42, showLabel = false, strokeWidth = 5 }: HealthRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, score)) / 100);
  const color = getHealthColor(score);
  const fontSize = size < 50 ? size * 0.28 : size * 0.24;

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EEF5FD"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      </svg>
      <span
        className="absolute font-bold"
        style={{ color, fontSize, lineHeight: 1 }}
      >
        {score}
      </span>
      {showLabel && (
        <span className="ml-2 text-xs font-semibold" style={{ color }}>
          {score >= 70 ? 'Healthy' : score >= 40 ? 'At-Risk' : 'Critical'}
        </span>
      )}
    </div>
  );
}
