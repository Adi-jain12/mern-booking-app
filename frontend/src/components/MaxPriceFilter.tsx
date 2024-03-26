type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

const MaxPriceFilter = ({ selectedPrice, onChange }: Props) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        className="p-2 border rounded-md w-full"
        value={selectedPrice}
        onChange={(event) =>
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined
          )
        }
      >
        <option value="">Select Max Price</option>

        {[500, 1000, 1500, 2000].map((maxPrice) => (
          <option value={maxPrice}>{maxPrice}</option>
        ))}
      </select>
    </div>
  );
};

export default MaxPriceFilter;
