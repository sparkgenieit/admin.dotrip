
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto mt-4">
      {children}
    </div>
  );
}
