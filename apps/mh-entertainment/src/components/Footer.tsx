import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl tracking-editorial mb-4">MH ENTERTAINMENT</h3>
            <p className="text-white/50 text-sm leading-relaxed uppercase tracking-editorial text-xs">Maison de Disque</p>
          </div>
          <div>
            <h4 className="text-xs tracking-wide-editorial uppercase text-white/50 mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link to="/submit-project" className="text-sm text-white/70 hover:text-white transition-colors">Submit Your Music</Link>
              <Link to="/radio-submission" className="text-sm text-white/70 hover:text-white transition-colors">Radio Submission</Link>
              <Link to="/tv-submission" className="text-sm text-white/70 hover:text-white transition-colors">TV Submission</Link>
              <Link to="/other-opportunities" className="text-sm text-white/70 hover:text-white transition-colors">Other Opportunities</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-wide-editorial uppercase text-white/50 mb-4">Contact</h4>
            <p className="text-sm text-white/70">info@mhentertainment.com</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/30 text-xs tracking-editorial">© {new Date().getFullYear()} MH ENTERTAINMENT. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
