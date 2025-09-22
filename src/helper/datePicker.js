import { DayPicker } from "react-day-picker";

export default function SubmenuDatePicker({ selected, onChange }) {
  return (
    <DayPicker
      mode="range"
      selected={selected}
      onSelect={onChange}
      defaultMonth={selected?.from}
    />
  );
}
