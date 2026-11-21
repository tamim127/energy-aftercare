// Wix Bookings Integration for Energy Aftercare Headless Frontend
import { wixFetch } from './sdk';
import { ensureTokens } from './members/auth';

export interface WixServiceInfo {
  serviceId: string;
  scheduleId: string;
  name: string;
}

export const WIX_BOOKING_SERVICES: Record<string, WixServiceInfo> = {
  'platinum-support-plan': {
    serviceId: '98b422fa-2253-4473-be38-d68c130418e4',
    scheduleId: '0ff5d8cb-15be-4bc7-9cc3-978c0390e3fc',
    name: 'Platinum Support Plan',
  },
  'gold-support-plan': {
    serviceId: '38bd3965-f3c5-4576-9baa-802c9e85651f',
    scheduleId: 'c2de3192-803e-4334-b52f-c00f509995f9',
    name: 'Gold Support Plan',
  },
  'silver-support-plan': {
    serviceId: '0937d69a-cd82-4fc2-8574-414578b70d57',
    scheduleId: 'f0a5db63-ee13-4502-a214-b4f8a9ee6bc3',
    name: 'Silver Support Plan',
  },
  'bronze-support-plan': {
    serviceId: 'd550936f-70c3-4c4a-88ac-1dd6ef67b878',
    scheduleId: '366cc506-d6a1-441c-96fa-6bf4c09732d9',
    name: 'Bronze Support Plan',
  },
};

export const STAFF_RESOURCE_ID = '43a93d1d-c32b-4a16-882e-71d9a6685f09';

export interface CreateBookingParams {
  slug: string;
  date: Date;
  slot: string; // e.g. "10:00"
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface CreateBookingResult {
  success: boolean;
  bookingId?: string;
  error?: string;
  field?: string;
}

/**
 * Normalizes user-entered phone number into a valid international E.164 string
 * expected by Wix APIs (e.g. +447987654321, +8801712345678, +14786362256).
 */
export function normalizePhoneNumber(rawPhone: string): string {
  let cleaned = rawPhone.trim();
  const hasPlus = cleaned.startsWith('+');
  const digits = cleaned.replace(/\D/g, '');

  if (!digits) return rawPhone;

  // 1. If explicit leading + was provided, strip formatting and keep +
  if (hasPlus) {
    return `+${digits}`;
  }

  // 2. If 00 prefix (e.g. 0044...), replace with +
  if (digits.startsWith('00')) {
    return `+${digits.slice(2)}`;
  }

  // 3. Bangladesh 11-digit mobile starting with 01 (017..., 018..., etc.)
  if (digits.length === 11 && digits.startsWith('01')) {
    return `+88${digits}`;
  }

  // 4. UK 11-digit mobile starting with 07 (07987...)
  if (digits.length === 11 && digits.startsWith('07')) {
    return `+44${digits.slice(1)}`;
  }

  // 5. UK standard landline or mobile starting with 0 (e.g. 020..., 01...)
  if (digits.length >= 10 && digits.startsWith('0')) {
    return `+44${digits.slice(1)}`;
  }

  // 6. Otherwise default with + prefix
  return `+${digits}`;
}

/**
 * Creates an appointment booking in Wix Bookings.
 * Automatically synchronizes with Wix CRM Contacts without duplicate contact creation.
 */
export async function createAppointmentBooking(params: CreateBookingParams): Promise<CreateBookingResult> {
  const serviceInfo = WIX_BOOKING_SERVICES[params.slug];
  if (!serviceInfo) {
    return { success: false, error: 'Unknown service plan selected.' };
  }

  try {
    await ensureTokens();

    const trimmedName = params.name.trim();
    const nameParts = trimmedName.split(/\s+/);
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || '.';

    const y = params.date.getFullYear();
    const m = String(params.date.getMonth() + 1).padStart(2, '0');
    const d = String(params.date.getDate()).padStart(2, '0');
    const [h, min] = params.slot.split(':');
    const startHour = String(h).padStart(2, '0');
    const endHour = String(Number(h) + 1).padStart(2, '0');

    // Slot start and end time in Europe/London (GMT)
    const startDate = `${y}-${m}-${d}T${startHour}:${min}:00Z`;
    const endDate = `${y}-${m}-${d}T${endHour}:${min}:00Z`;

    const normalizedPhone = normalizePhoneNumber(params.phone);

    const bookingBody = {
      booking: {
        bookedEntity: {
          slot: {
            serviceId: serviceInfo.serviceId,
            scheduleId: serviceInfo.scheduleId,
            startDate,
            endDate,
            timezone: 'Europe/London',
            resource: {
              id: STAFF_RESOURCE_ID,
            },
            location: {
              locationType: 'OWNER_BUSINESS',
            },
          },
        },
        totalParticipants: 1,
      },
      formSubmission: {
        first_name: firstName,
        last_name: lastName,
        email: params.email.trim(),
        phone: normalizedPhone,
        add_your_message: params.notes?.trim() || '',
      },
      participantNotification: { notifyParticipants: false },
    };

    const res = await wixFetch('/bookings/v2/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingBody),
    });

    const data = await res.json();

    if (!res.ok) {
      const rawMsg =
        data?.message ||
        data?.details?.applicationError?.description ||
        '';

      if (
        rawMsg.toLowerCase().includes('phone') ||
        rawMsg.toLowerCase().includes('country code')
      ) {
        return {
          success: false,
          field: 'phone',
          error:
            'Please enter a valid phone number with country code (e.g. +44 7987 654321 or +880 1712 345678).',
        };
      }

      return {
        success: false,
        error: rawMsg || 'Unable to book this time slot. Please select another slot.',
      };
    }

    return {
      success: true,
      bookingId: data?.booking?.id,
    };
  } catch (err: any) {
    console.error('Failed to create booking:', err);
    return {
      success: false,
      error: err?.message || 'A network error occurred while booking. Please try again.',
    };
  }
}

export interface CreateCheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

export const WIX_BOOKINGS_APP_ID = '13d21c63-b5ec-5912-8397-c3a5ddb27a97';

/**
 * Creates a Wix eCommerce Checkout session for a created booking and retrieves
 * the hosted checkout URL where the customer can pay online via Wix Payments/Card/PayPal.
 */
export async function createBookingCheckout(bookingId: string): Promise<CreateCheckoutResult> {
  try {
    await ensureTokens();

    const checkoutRes = await wixFetch('/ecom/v1/checkouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkout: {
          channelType: 'WEB',
          lineItems: [
            {
              catalogReference: {
                appId: WIX_BOOKINGS_APP_ID,
                catalogItemId: bookingId,
              },
              quantity: 1,
            },
          ],
        },
      }),
    });

    const checkoutData = await checkoutRes.json();
    if (!checkoutRes.ok || !checkoutData?.checkout?.id) {
      const msg = checkoutData?.message || checkoutData?.details?.applicationError?.description;
      return {
        success: false,
        error: msg || 'Unable to initialize payment checkout for this booking.',
      };
    }

    const checkoutId = checkoutData.checkout.id;

    const urlRes = await wixFetch(`/ecom/v1/checkouts/${checkoutId}/checkout-url`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const urlData = await urlRes.json();
    if (!urlRes.ok || !urlData?.checkoutUrl) {
      const msg = urlData?.message || urlData?.details?.applicationError?.description;
      return {
        success: false,
        error: msg || 'Unable to generate checkout URL for payment.',
      };
    }

    return {
      success: true,
      checkoutUrl: urlData.checkoutUrl,
    };
  } catch (err: any) {
    console.error('Failed to create booking checkout:', err);
    return {
      success: false,
      error: err?.message || 'Failed to connect to checkout service. Please try again.',
    };
  }
}
