import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useParams } from "react-router-dom";
import { useSearchContext } from "../contexts/SearchContext";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../forms/BookingForm/BookingDetailsSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
  const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { hotelId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      //getTime() will give time in milliseconds so subtracting both and dividing to get number in days
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights)); //Math.ceil is for getting whole number
    }
  }, [search.checkIn, search.checkOut]);

  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(
        hotelId as string,
        numberOfNights.toString()
      ),
    {
      enabled: !!hotelId && numberOfNights > 0, //check this and then call the API
    }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  const { data: hotelData } = useQuery(
    "viewMyHotel",
    () => apiClient.viewMyHotel(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  if (!hotelData) {
    return <></>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-4">
      {/*1fr will take 1/3 of left container and 2fr will take 2/3 of right container */}

      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotelData}
      />

      {currentUser && paymentIntentData && (
        <Elements
          //stripePromise coming from AppContext which connects the stripe and sends as prop whenever the app loads for the first time
          stripe={stripePromise}
          //clientSecret coming from createPayemtIntent API which gives response which includes clientSecret from backend when intent is created
          options={{ clientSecret: paymentIntentData.clientSecret }}
        >
          {/* Elements tag coming from stripe SDK and it is used for using stripe UI on frontend to make payments using Cards*/}
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
