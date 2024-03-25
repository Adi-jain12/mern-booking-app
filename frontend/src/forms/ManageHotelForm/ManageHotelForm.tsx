import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";

export type HotelFormType = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
};

type Props = {
  hotel?: HotelType; //defining hotel? because we want to pass hotel prop as optional as <AddHotel> will not pass hotel as prop whereas <EditHotel> will pass hotel as prop so handling both scenarios
  onSave: (hotelFormData: FormData) => void; //declaring type for hotelFormData because we will be sending formData like this onSave(formData) in onSubmit func
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  //not destructuring anything from useForm because form will be divide into componenets so this variable will hold all the data
  const formMethods = useForm<HotelFormType>();
  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]); // reset the form for populating EditHotel page whenever the hotel changes

  const onSubmit = handleSubmit((formDataJson: HotelFormType) => {
    const formData = new FormData(); //converting formDataJson of argument to formData Object

    //if we are on edit hotel page and passing hotel and if hotel is truthy so add hotelId to the form data as we want to know the hotelId of the hotel we want to edit
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }

    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", formDataJson.pricePerNight.toString()); //convert to string because pricePerNight is of type number and formData object only deals with string type
    formData.append("starRating", formDataJson.starRating.toString());
    formData.append("adultCount", formDataJson.adultCount.toString());
    formData.append("childCount", formDataJson.childCount.toString());

    //formDataJson.facilities is an array so for each element in array we are appending with using index of facilities and appending that facility (same format like above appends)
    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    //[image1.jpg, image2.jpg, image3.jpg, image4.jpg] => when we have imageUrls with 4 images
    //[image2.jpg] => when we edit hotel and want to remove 3 other images the new imageUrls array will be with one image in it
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    //filling formDataJson.imageFiles to an array because formDataJson.imageFiles is of type FileList and we cannot perform forEach operation on FileList
    Array.from(formDataJson.imageFiles).forEach((image) => {
      formData.append("imageFiles", image);
    });

    onSave(formData);
  });

  return (
    //it will act as a Context API to child components
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
