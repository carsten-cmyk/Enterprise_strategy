export function Card({ children, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`p-4 pb-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-4 pt-0 ${className}`}>
      {children}
    </div>
  );
}
