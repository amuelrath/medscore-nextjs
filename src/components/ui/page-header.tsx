export default function PageHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-4 bg-white h-16 text-black z-11 flex flex-row fixed top-0 w-full font-poppins justify-between items-center pr-20">
      {children}
    </div>
  );
}
