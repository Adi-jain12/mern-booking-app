import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import React, { useState } from "react";
import SearchResultCard from "../components/SearchResultCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypeFilter from "../components/HotelTypeFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import MaxPriceFilter from "../components/MaxPriceFilter";
import SortingFilter from "../components/SortingFilter";

const Search = () => {
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<
    number | undefined
  >();
  const [selectedSortingOption, setSelectedSortingOption] = useState<
    string | undefined
  >("");

  const search = useSearchContext();

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(), //converts Date type into string as api accepts string as parameters
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedMaxPrice?.toString(),
    sortOption: selectedSortingOption,
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars(
      (prevStars) =>
        event.target.checked
          ? [...prevStars, starRating] // checking if the user selected any star and if yes it will add with the previous selected stars
          : prevStars.filter((star) => star !== starRating) // if user unchecks the star it will filter out the selected stars
    );
  };

  const handleHotelTypesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelType = event.target.value;

    setSelectedHotelTypes((prevTypes) =>
      event.target.checked
        ? [...prevTypes, hotelType]
        : prevTypes.filter((type) => type !== hotelType)
    );
  };

  const handleFacilitiesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFacility = event.target.value;

    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, selectedFacility]
        : prevFacilities.filter((facility) => facility !== selectedFacility)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>

          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />

          <HotelTypeFilter
            selectedHotelTypes={selectedHotelTypes}
            onChange={handleHotelTypesChange}
          />

          <FacilitiesFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilitiesChange}
          />

          <MaxPriceFilter
            selectedPrice={selectedMaxPrice}
            onChange={(value?: number) => setSelectedMaxPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination?.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>

          <SortingFilter
            selectedSortingOption={selectedSortingOption}
            onChange={(value?: string) => setSelectedSortingOption(value)}
          />
        </div>

        {hotelData?.data.map((hotel) => (
          <SearchResultCard hotel={hotel} />
        ))}

        <div>
          <Pagination
            page={hotelData?.pagination.page || 1}
            pages={hotelData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
