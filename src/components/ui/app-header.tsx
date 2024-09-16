import Image from 'next/image';
import LOGO from 'public/logo-reversed.svg';

export function AppHeader() {
  return (
    <div className="flex bg-primary min-h-10 max-h-10 space-x-6 min-w-screen flex-row items-center px-4">
      <Image src={LOGO} alt="logo" width={150} height={75} />
    </div>
  );
}
