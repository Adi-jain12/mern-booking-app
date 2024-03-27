import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useParams } from "react-router-dom";
import { useSearchContext } from "../contexts/SearchContext";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../forms/BookingForm/BookingDetailsSummary";

const Booking = () => {
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

      {currentUser && <BookingForm currentUser={currentUser} />}
    </div>
  );
};

export default Booking;
