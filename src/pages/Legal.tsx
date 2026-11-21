import LegalPage from '../components/LegalPage';
import { privacyContent } from '../content/privacy';
import { cookieContent } from '../content/cookies';
import { termsContent } from '../content/terms';

export const PrivacyPage = () => <LegalPage content={privacyContent} />;
export const CookiePage = () => <LegalPage content={cookieContent} />;
export const TermsPage = () => <LegalPage content={termsContent} />;
