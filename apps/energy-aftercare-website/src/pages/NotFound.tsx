import { ArrowLeft } from 'lucide-react';
import { LogoMark } from '../components/Logo';
import { BtnLink, usePageMeta } from '../components/ui';

export default function NotFound() {
  usePageMeta('404 | Energy Aftercare');
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ea-black text-ea-white">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ea-green/10 blur-[120px]" />
      <div className="ea-container relative text-center">
        <LogoMark className="mx-auto h-14 w-14 text-ea-white" />
        <p className="mt-8 text-[7rem] font-extrabold leading-none tracking-tighter text-ea-green md:text-[10rem]">404</p>
        <BtnLink to="/" className="mt-10"><ArrowLeft className="h-4 w-4" /> Home</BtnLink>
      </div>
    </section>
  );
}
