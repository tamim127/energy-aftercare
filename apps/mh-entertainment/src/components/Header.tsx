import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-white font-serif text-xl tracking-editorial">
          MH ENTERTAINMENT
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#about" className="text-white/70 hover:text-white text-xs tracking-wide-editorial uppercase transition-colors">About</a>
          <a href="/#submissions" className="text-white/70 hover:text-white text-xs tracking-wide-editorial uppercase transition-colors">Submit</a>
          <Link to="/submit-project" className="text-xs tracking-wide-editorial uppercase bg-white text-black px-5 py-2 hover:bg-black hover:text-white border border-white transition-all duration-300">
            Submit Your Music
          </Link>
        </nav>
      </div>
    </header>
  );
}
