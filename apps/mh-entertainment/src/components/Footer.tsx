import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background border-t border-background/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl tracking-editorial mb-4">MH ENTERTAINMENT</h3>
            <p className="text-background/40 text-xs tracking-wide-editorial uppercase">Maison de Disque</p>
          </div>
          <div>
            <h4 className="text-xs tracking-wide-editorial uppercase text-background/40 mb-5">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link to="/submit-project" className="text-sm text-background/60 hover:text-background transition-colors">Submit Your Music</Link>
              <Link to="/radio-submission" className="text-sm text-background/60 hover:text-background transition-colors">Radio Submission</Link>
              <Link to="/tv-submission" className="text-sm text-background/60 hover:text-background transition-colors">TV Submission</Link>
              <Link to="/other-opportunities" className="text-sm text-background/60 hover:text-background transition-colors">Other Opportunities</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-wide-editorial uppercase text-background/40 mb-5">Contact</h4>
            <a href="mailto:info@mhentertainment.com" className="text-sm text-background/60 hover:text-background transition-colors">
              info@mhentertainment.com
            </a>
          </div>
        </div>
        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-background/25 text-xs tracking-editorial">© {new Date().getFullYear()} MH ENTERTAINMENT. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
