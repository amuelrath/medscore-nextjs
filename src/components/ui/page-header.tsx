export default function PageHeader({
  children,
  title,
  subtitle,
}: {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="pt-2 bg-white z-11 flex flex-row fixed top-0 w-full font-poppins justify-between items-center pr-20">
      <div>
        <h1 className="font-bold text-2xl text-black">{title || ""}</h1>
        <p className="text-xs">{subtitle || ""}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
