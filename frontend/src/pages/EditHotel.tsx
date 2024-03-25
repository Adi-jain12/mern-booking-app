import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useMutation, useQuery } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();

  const { data: hotel } = useQuery(
    "viewMyHotel",
    () => apiClient.viewMyHotel(hotelId || ""),
    {
      enabled: !!hotelId, //to only run this api if we receive hotelId from params as a string
    }
  );

  const { mutate, isLoading } = useMutation(apiClient.updatedMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel updated!", type: "SUCCESS" });
    },

    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  const handleSaveEditForm = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return (
    <ManageHotelForm
      hotel={hotel}
      onSave={handleSaveEditForm}
      isLoading={isLoading}
    />
  );
};

export default EditHotel;
