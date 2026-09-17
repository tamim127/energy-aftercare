import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="bg-foreground text-background pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <p className="text-xs tracking-wide-editorial uppercase text-background/30 mb-4">MH Entertainment</p>
          <h1 className="font-serif text-3xl md:text-5xl font-light tracking-tight mb-6">{title}</h1>
          <div className="w-12 h-px bg-background/20 mx-auto mb-6" />
          <p className="text-background/40 text-sm leading-relaxed max-w-xl mx-auto">{intro}</p>
        </div>
      </section>

      {/* Form Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          {success ? (
            <div className="text-center py-16">
              <div className="flex items-center justify-center mb-8">
                <CheckCircle className="w-14 h-14 text-foreground" strokeWidth={1} />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl mb-4 text-foreground">{successMessage}</h2>
              <div className="w-12 h-px bg-foreground/15 mx-auto my-6" />
              <p className="text-foreground/40 text-sm max-w-md mx-auto leading-relaxed mb-10">
                Submission does not guarantee acceptance, representation, promotion, radio play, television broadcast, distribution, or any other service.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs tracking-wide-editorial uppercase text-foreground/60 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          ) : (
            children
          )}
        </div>
      </section>

      {/* Legal notice */}
      {!success && (
        <section className="bg-muted py-8">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-[10px] text-foreground/25 leading-relaxed text-center tracking-wide">
              Submission does not guarantee acceptance, representation, promotion, radio play, television broadcast, distribution, or any other service. MH Entertainment will review submissions according to its current opportunities and requirements.
            </p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
