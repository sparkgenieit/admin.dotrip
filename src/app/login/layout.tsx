'use client';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="flex justify-center pt-16 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          {children}
        </div>
      </main>
    </div>
  );
}
