import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export default function Loading({ 
  message = 'Loading...', 
  size = 'md', 
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
