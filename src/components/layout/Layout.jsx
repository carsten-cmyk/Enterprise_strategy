import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
