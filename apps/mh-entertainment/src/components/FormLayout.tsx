import { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface FormLayoutProps {
  title: string;
  intro: string;
  children: ReactNode;
  success: boolean;
  successMessage: string;
}

export default function FormLayout({ title, intro, children, success, successMessage }: FormLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Banner */}
      <section className="bg-black text-white pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <p className="text-xs tracking-wide-editorial uppercase text-white/40 mb-4">MH Entertainment</p>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-tight mb-6">{title}</h1>
          <div className="w-12 h-px bg-white/30 mx-auto mb-6" />
          <p className="text-white/50 text-sm leading-relaxed max-w-xl mx-auto">{intro}</p>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {success ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-8">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl mb-4">{successMessage}</h2>
              <div className="w-12 h-px bg-black/20 mx-auto my-6" />
              <p className="text-black/50 text-sm max-w-md mx-auto leading-relaxed">
                Submission does not guarantee acceptance, representation, promotion, radio play, television broadcast, distribution, or any other service.
              </p>
            </div>
          ) : (
            children
          )}
        </div>
      </section>

      {/* Legal notice */}
      {!success && (
        <section className="bg-neutral-50 py-8">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-[10px] text-black/30 leading-relaxed text-center tracking-wide">
              Submission does not guarantee acceptance, representation, promotion, radio play, television broadcast, distribution, or any other service. MH Entertainment will review submissions according to its current opportunities and requirements.
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
