import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-foreground/10">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-foreground font-serif text-xl tracking-editorial">
          MH ENTERTAINMENT
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/#about" className="text-foreground/60 hover:text-foreground text-xs tracking-wide-editorial uppercase transition-colors">About</a>
          <a href="/#submissions" className="text-foreground/60 hover:text-foreground text-xs tracking-wide-editorial uppercase transition-colors">Submit</a>
          <Link
            to="/submit-project"
            className="text-xs tracking-wide-editorial uppercase bg-foreground text-background px-5 py-2.5 hover:bg-transparent hover:text-foreground border border-foreground transition-all duration-300"
          >
            Submit Your Music
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground p-1"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-foreground/10 px-6 pb-6 pt-2 flex flex-col gap-4">
          <a href="/#about" onClick={() => setOpen(false)} className="text-foreground/60 hover:text-foreground text-xs tracking-wide-editorial uppercase transition-colors py-2">About</a>
          <a href="/#submissions" onClick={() => setOpen(false)} className="text-foreground/60 hover:text-foreground text-xs tracking-wide-editorial uppercase transition-colors py-2">Submit</a>
          <Link
            to="/submit-project"
            onClick={() => setOpen(false)}
            className="text-xs tracking-wide-editorial uppercase bg-foreground text-background px-5 py-3 text-center border border-foreground transition-all duration-300"
          >
            Submit Your Music
          </Link>
        </div>
      )}
    </header>
  );
}
