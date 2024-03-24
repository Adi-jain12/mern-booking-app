import { useFormContext } from "react-hook-form";
import { HotelFormType } from "./ManageHotelForm";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormType>();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Select Images</h2>

      <div className="border rounded p-4 flex flex-col gap-4">
        <input
          type="file"
          multiple
          accept="image/*" // only accept images of type .jpg .png etc...
          className="w-full font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalImagesLength = imageFiles.length;
              if (totalImagesLength === 0) {
                return "At least one image should be added";
              }
              if (totalImagesLength > 6) {
                return "Total number of images cannot be more than 6!";
              }
              return true;
            },
          })}
        />
        {errors.imageFiles && (
          <span className="text-red-500 text-sm font-bold">
            {errors.imageFiles.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default ImagesSection;
