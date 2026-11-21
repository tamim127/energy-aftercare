import { Link } from 'react-router-dom';
import { Music, Radio, Tv, Briefcase, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const submissionCards = [
  {
    title: 'SUBMIT MY PROJECT',
    description: 'Submit your music project to MH Entertainment for professional consideration.',
    button: 'SUBMIT MY PROJECT',
    link: '/submit-project',
    icon: Music,
  },
  {
    title: 'RADIO SINGLE SUBMISSION',
    description: 'Submit your single for radio consideration and promotion.',
    button: 'SUBMIT FOR RADIO',
    link: '/radio-submission',
    icon: Radio,
  },
  {
    title: 'TV MUSIC VIDEO SUBMISSION',
    description: 'Submit your official music video for television and media consideration.',
    button: 'SUBMIT MUSIC VIDEO',
    link: '/tv-submission',
    icon: Tv,
  },
  {
    title: 'OTHER OPPORTUNITIES',
    description: 'Explore additional music, media, licensing, partnership, and collaboration opportunities.',
    button: 'EXPLORE OPPORTUNITIES',
    link: '/other-opportunities',
    icon: Briefcase,
  },
];

function SubmissionCard({ title, description, button, link, icon: Icon }: typeof submissionCards[0]) {
  return (
    <Link to={link} className="group block h-full">
      <div className="bg-background border border-foreground/8 p-8 md:p-10 transition-all duration-500 group-hover:bg-foreground group-hover:border-foreground h-full flex flex-col">
        <div className="mb-8">
          <Icon className="w-7 h-7 text-foreground/25 group-hover:text-background/50 transition-colors duration-500" strokeWidth={1} />
        </div>
        <h3 className="font-serif text-lg md:text-xl tracking-editorial text-foreground group-hover:text-background transition-colors duration-500 mb-3">
          {title}
        </h3>
        <p className="text-sm text-foreground/50 group-hover:text-background/50 transition-colors duration-500 leading-relaxed mb-8 flex-1">
          {description}
        </p>
        <div className="flex items-center gap-2 text-xs tracking-wide-editorial uppercase text-foreground/60 group-hover:text-background/70 transition-all duration-500">
          {button}
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-foreground text-background min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,_rgba(255,255,255,0.04)_0%,_transparent_60%)]" />
        <div className="container mx-auto px-6 text-center relative z-10 pt-16">
          <p className="text-xs tracking-wide-editorial uppercase text-background/30 mb-8">
            Maison de Disque
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[6.5rem] font-light tracking-tight leading-[0.95] mb-10">
            MH ENTERTAINMENT
          </h1>
          <div className="w-16 h-px bg-background/20 mx-auto mb-8" />
          <p className="text-background/40 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-14">
            A premium international music entertainment company dedicated to discovering, developing, and promoting exceptional talent worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/submit-project"
              className="inline-flex items-center justify-center gap-2 text-xs tracking-wide-editorial uppercase bg-background text-foreground px-8 py-4 hover:bg-transparent hover:text-background border border-background transition-all duration-300"
            >
              Submit Your Music
            </Link>
            <a
              href="#submissions"
              className="inline-flex items-center justify-center gap-2 text-xs tracking-wide-editorial uppercase bg-transparent text-background/70 px-8 py-4 hover:bg-background hover:text-foreground border border-background/20 hover:border-background transition-all duration-300"
            >
              Explore Opportunities
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-background py-28 md:py-36">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="text-xs tracking-wide-editorial uppercase text-foreground/35 mb-6">About</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light mb-8">
            Music. Culture. Vision.
          </h2>
          <div className="w-12 h-px bg-foreground/15 mx-auto mb-10" />
          <p className="text-foreground/50 leading-relaxed md:text-lg max-w-2xl mx-auto">
            MH Entertainment is a forward-thinking music entertainment company that brings together artists,
            producers, and creative professionals from around the world. We provide opportunities in music production,
            radio promotion, television placement, licensing, and global distribution.
          </p>
        </div>
      </section>

      {/* Submissions Section */}
      <section id="submissions" className="bg-muted py-28 md:py-36">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-wide-editorial uppercase text-foreground/35 mb-6">Opportunities</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-6">
              SUBMIT YOUR PROJECT
            </h2>
            <div className="w-12 h-px bg-foreground/15 mx-auto mb-6" />
            <p className="text-foreground/50 max-w-xl mx-auto">
              Choose the submission opportunity that best matches your project.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {submissionCards.map((card) => (
              <SubmissionCard key={card.link} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground text-background py-28 md:py-36">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <p className="text-xs tracking-wide-editorial uppercase text-background/30 mb-6">Get Started</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light mb-8">
            Work With MH Entertainment
          </h2>
          <div className="w-12 h-px bg-background/20 mx-auto mb-10" />
          <p className="text-background/40 mb-14 leading-relaxed">
            Whether you are an established artist or an emerging talent, we invite you to submit your project for professional consideration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit-project" className="inline-flex items-center justify-center text-xs tracking-wide-editorial uppercase bg-background text-foreground px-8 py-4 hover:bg-transparent hover:text-background border border-background transition-all duration-300">
              Submit My Project
            </Link>
            <Link to="/other-opportunities" className="inline-flex items-center justify-center text-xs tracking-wide-editorial uppercase text-background/70 px-8 py-4 hover:bg-background hover:text-foreground border border-background/20 hover:border-background transition-all duration-300">
              Explore Opportunities
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
