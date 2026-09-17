import { Link } from 'react-router-dom';
import { Music, Radio, Tv, Briefcase } from 'lucide-react';
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
    <Link to={link} className="group block">
      <div className="bg-white border border-black/10 p-8 md:p-10 transition-all duration-500 group-hover:bg-black group-hover:border-black h-full flex flex-col">
        <div className="mb-6">
          <Icon className="w-8 h-8 text-black/30 group-hover:text-white/50 transition-colors duration-500" strokeWidth={1} />
        </div>
        <h3 className="font-serif text-xl md:text-2xl tracking-editorial text-black group-hover:text-white transition-colors duration-500 mb-4">
          {title}
        </h3>
        <p className="text-sm text-black/60 group-hover:text-white/60 transition-colors duration-500 leading-relaxed mb-8 flex-1">
          {description}
        </p>
        <div className="inline-block self-start text-xs tracking-wide-editorial uppercase border border-black text-black px-6 py-3 group-hover:border-white group-hover:text-white transition-all duration-500">
          {button}
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
      <section className="bg-black text-white min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
        <div className="container mx-auto px-6 text-center relative z-10 pt-16">
          <p className="text-xs tracking-wide-editorial uppercase text-white/40 mb-6 animate-fade-in">Maison de Disque</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8">
            MH ENTERTAINMENT
          </h1>
          <div className="w-16 h-px bg-white/30 mx-auto mb-8" />
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-12">
            A premium international music entertainment company dedicated to discovering, developing, and promoting exceptional talent worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/submit-project"
              className="text-xs tracking-wide-editorial uppercase bg-white text-black px-8 py-4 hover:bg-transparent hover:text-white border border-white transition-all duration-300"
            >
              Submit Your Music
            </Link>
            <a
              href="#submissions"
              className="text-xs tracking-wide-editorial uppercase bg-transparent text-white px-8 py-4 hover:bg-white hover:text-black border border-white/30 transition-all duration-300"
            >
              Explore Opportunities
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-24 md:py-32">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-xs tracking-wide-editorial uppercase text-black/40 mb-6">About</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light mb-8">
            Music. Culture. Vision.
          </h2>
          <div className="w-12 h-px bg-black/20 mx-auto mb-8" />
          <p className="text-black/60 leading-relaxed md:text-lg max-w-2xl mx-auto">
            MH Entertainment is a forward-thinking music entertainment company that brings together artists,
            producers, and creative professionals from around the world. We provide opportunities in music production,
            radio promotion, television placement, licensing, and global distribution.
          </p>
        </div>
      </section>

      {/* Submissions Section */}
      <section id="submissions" className="bg-neutral-50 py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-wide-editorial uppercase text-black/40 mb-6">Opportunities</p>
            <h2 className="font-serif text-3xl md:text-5xl font-light mb-6">
              SUBMIT YOUR PROJECT
            </h2>
            <div className="w-12 h-px bg-black/20 mx-auto mb-6" />
            <p className="text-black/60 max-w-xl mx-auto">
              Choose the submission opportunity that best matches your project.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {submissionCards.map((card) => (
              <SubmissionCard key={card.link} {...card} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-24 md:py-32">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <p className="text-xs tracking-wide-editorial uppercase text-white/40 mb-6">Get Started</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light mb-8">
            Work With MH Entertainment
          </h2>
          <div className="w-12 h-px bg-white/30 mx-auto mb-8" />
          <p className="text-white/50 mb-12 leading-relaxed">
            Whether you are an established artist or an emerging talent, we invite you to submit your project for professional consideration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit-project" className="text-xs tracking-wide-editorial uppercase bg-white text-black px-8 py-4 hover:bg-transparent hover:text-white border border-white transition-all duration-300">
              Submit My Project
            </Link>
            <Link to="/other-opportunities" className="text-xs tracking-wide-editorial uppercase text-white px-8 py-4 hover:bg-white hover:text-black border border-white/30 transition-all duration-300">
              Work With MH Entertainment
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
