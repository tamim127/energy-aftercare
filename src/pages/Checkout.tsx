import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, ShieldCheck, AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import { getRedirectCheckoutUrl } from '../wix/bookings';
import { btn } from '../components/ui';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const checkoutId = searchParams.get('checkoutId') || '';
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutId) {
      setError('No active checkout session found. Please select a support plan to book.');
      return;
    }

    let isMounted = true;

    async function proceedToWixCheckout() {
      try {
        const fullUrl = await getRedirectCheckoutUrl(checkoutId);
        if (isMounted) {
          if (fullUrl) {
            window.location.replace(fullUrl);
          } else {
            setError('Unable to load payment gateway for this checkout session.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to connect to checkout service. Please try again.');
        }
      }
    }

    proceedToWixCheckout();

    return () => {
      isMounted = false;
    };
  }, [checkoutId]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-ea-black text-ea-white px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-ea-grey/25 bg-ea-ink p-8 text-center shadow-2xl space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ea-green/10 text-ea-green mx-auto border border-ea-green/30">
          {error ? <AlertCircle className="h-8 w-8 text-red-400" /> : <Lock className="h-8 w-8 animate-pulse text-ea-green" />}
        </div>

        {error ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ea-white">Checkout Connection Issue</h2>
            <p className="text-sm text-ea-grey leading-relaxed">{error}</p>
            <div className="pt-2">
              <Link
                to="/book-online"
                className={btn.primary + ' w-full justify-center text-center'}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Return to Support Plans
              </Link>
            </div>
            <p className="text-xs text-ea-grey">
              Need assistance? Contact our team directly on{' '}
              <a href="tel:07943812137" className="text-ea-green underline">
                07943 812137
              </a>{' '}
              or email{' '}
              <a href="mailto:info@energyaftercare.co.uk" className="text-ea-green underline">
                info@energyaftercare.co.uk
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ea-white flex items-center justify-center gap-2">
              <span>Connecting to Secure Wix Checkout</span>
              <Loader2 className="h-5 w-5 animate-spin text-ea-green" />
            </h2>
            <p className="text-sm text-ea-grey leading-relaxed">
              Please wait while we transfer you to our encrypted payment portal for online card and PayPal payment...
            </p>
            <div className="rounded-2xl border border-ea-grey/20 bg-ea-black/50 p-3 flex items-center justify-center gap-2 text-xs text-ea-green font-medium">
              <ShieldCheck className="h-4 w-4" /> 256-Bit SSL Encrypted Payment Gateway
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
