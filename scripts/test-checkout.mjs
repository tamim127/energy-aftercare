import { createClient, OAuthStrategy } from '@wix/sdk';

const WIX_CLIENT_ID = 'bd674216-0a4d-4728-a32b-26c8d700c209';

const client = createClient({
  auth: OAuthStrategy({ clientId: WIX_CLIENT_ID }),
});

async function run() {
  const visitorTokens = await client.auth.generateVisitorTokens();
  client.auth.setTokens(visitorTokens);

  console.log('Got visitor tokens');

  // Let's create an appointment booking for bronze plan to test
  const startDate = '2026-11-28T14:00:00Z';
  const endDate = '2026-11-28T15:00:00Z';

  const bookingRes = await client.fetchWithAuth('https://www.wixapis.com/bookings/v2/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      booking: {
        bookedEntity: {
          slot: {
            serviceId: 'd550936f-70c3-4c4a-88ac-1dd6ef67b878', // Bronze Support Plan (£79)
            scheduleId: '366cc506-d6a1-441c-96fa-6bf4c09732d9',
            startDate,
            endDate,
            timezone: 'Europe/London',
            resource: { id: '43a93d1d-c32b-4a16-882e-71d9a6685f09' },
            location: { locationType: 'OWNER_BUSINESS' },
          },
        },
        totalParticipants: 1,
      },
      formSubmission: {
        first_name: 'Test',
        last_name: 'PaymentUser',
        email: 'testpayment@example.com',
        phone: '+447911123456',
        add_your_message: 'Testing payment checkout integration',
      },
      participantNotification: { notifyParticipants: false },
    }),
  });

  const bookingData = await bookingRes.json();
  console.log('Booking status:', bookingRes.status, bookingData.booking?.id, bookingData.booking?.status);

  if (!bookingData.booking?.id) {
    console.error('Failed to create booking:', bookingData);
    return;
  }

  const bookingId = bookingData.booking.id;

  // Now create checkout
  const checkoutRes = await client.fetchWithAuth('https://www.wixapis.com/ecom/v1/checkouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      checkout: {
        channelType: 'WEB',
        lineItems: [
          {
            catalogReference: {
              appId: '13d21c63-b5ec-5912-8397-c3a5ddb27a97',
              catalogItemId: bookingId,
            },
            quantity: 1,
          },
        ],
      },
    }),
  });

  const checkoutData = await checkoutRes.json();
  console.log('Checkout status:', checkoutRes.status, checkoutData.checkout?.id);
  if (!checkoutData.checkout?.id) {
    console.error('Failed to create checkout:', checkoutData);
    return;
  }

  const checkoutId = checkoutData.checkout.id;

  // Now get checkout URL
  const urlRes = await client.fetchWithAuth(`https://www.wixapis.com/ecom/v1/checkouts/${checkoutId}/checkout-url`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const urlData = await urlRes.json();
  console.log('Checkout URL status:', urlRes.status, urlData);
}

run().catch(console.error);
