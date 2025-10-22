export function Input({
  value,
  onChange,
  placeholder = '',
  autoFocus = false,
  className = '',
  type = 'text'
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent ${className}`}
    />
  );
}

export function Textarea({
  value,
  onChange,
  placeholder = '',
  rows = 3,
  className = ''
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none ${className}`}
    />
  );
}

export function Label({ children, className = '' }) {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
      {children}
    </label>
  );
}
