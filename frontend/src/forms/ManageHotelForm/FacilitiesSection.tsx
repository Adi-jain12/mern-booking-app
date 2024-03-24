import { hotelFacilities } from "../../config/hotel-options-config";
import { useFormContext } from "react-hook-form";
import { HotelFormType } from "./ManageHotelForm";

const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormType>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Facilities</h2>

      <div className="grid grid-cols-5 gap-3 border p-4">
        {hotelFacilities.map((facility) => (
          <label className="text-sm flex gap-1" key={facility}>
            <input
              type="checkbox"
              className=""
              value={facility}
              {...register("facilities", {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true;
                  } else {
                    return "At least one facility is required";
                  }
                },
              })}
            />
            {facility}
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-red-500 text-sm font-bold">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default FacilitiesSection;
