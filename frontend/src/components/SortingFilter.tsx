type Props = {
  selectedSortingOption?: string;
  onChange: (value?: string) => void;
};

const SortingFilter = ({ selectedSortingOption, onChange }: Props) => {
  return (
    <div>
      <select
        className="p-2 border rounded-md w-full"
        value={selectedSortingOption}
        onChange={(event) =>
          onChange(event.target.value ? event.target.value : undefined)
        }
      >
        <option value="">Sort By</option>

        <option value="starRating">Star Rating</option>
        <option value="pricePerNightAsc">Price Per Night (Low to High)</option>
        <option value="pricePerNightDesc">Price Per Night (High to Low)</option>
      </select>
    </div>
  );
};

export default SortingFilter;
