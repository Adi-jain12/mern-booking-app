import { useFormContext } from "react-hook-form";
import { HotelFormType } from "./ManageHotelForm";

const ImagesSection = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormType>();

  const existingImageUrls = watch("imageUrls"); //this will take the image urls from HotelForm type

  const handleDeleteImage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();

    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Select Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url) => (
              <div className="relative group">
                <img src={url} className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDeleteImage(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*" // only accept images of type .jpg .png etc...
          className="w-full font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalImagesLength =
                imageFiles.length + (existingImageUrls?.length || 0); // checks for both add hotel page and edit hotel page
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
