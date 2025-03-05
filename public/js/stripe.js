/* eslint-disable */
import axios from 'axios';
const stripe = Stripe(
  'pk_test_51O2BUnAyjQ235vOrAw68ftV7gDztRGJXA1v1Ix3sMcXy0rSUaxfNt4UGibzsJuVVBvmwOrJwDz2n9B5OTnraRUb000gpp1FbSN',
);
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const url = `/api/v1/bookings/checkout-session/${tourId}`;
    const session = await axios.get(url);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error.response.data.message);
  }
};
