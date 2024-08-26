import Image from 'next/image';
import LOGO from 'public/logo-reversed.svg';

export function AppHeader() {
  return (
    <div className="flex bg-gradient-to-r from-primary from-[75%] to-accent-secondary min-h-10  max-h-10 space-x-6 min-w-screen flex-row items-center border-b border-neutral-300 px-2">
      <Image src={LOGO} alt="logo" width={150} height={75} />
    </div>
  );
}
