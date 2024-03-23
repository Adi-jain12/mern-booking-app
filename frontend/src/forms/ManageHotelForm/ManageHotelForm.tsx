import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";

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
  adultCount: number;
  childCount: number;
};

const ManageHotelForm = () => {
  //not destructuring anything from useForm because form will be divide into componenets so this variable will hold all the data
  const formMethods = useForm<HotelFormType>();

  return (
    //it will act as a Context API to child components
    <FormProvider {...formMethods}>
      <form>
        <DetailsSection />
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
