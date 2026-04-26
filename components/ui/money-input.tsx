import * as React from "react";
import { CustomInput } from "./custom-input";
import { formatNumberWithCommas, parseFormattedNumber } from "@/components/features/split-money/utils";

interface MoneyInputProps extends Omit<React.ComponentProps<typeof CustomInput>, "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
}

export function MoneyInput({ value, onChange, ...props }: MoneyInputProps) {
  const [displayValue, setDisplayValue] = React.useState(value > 0 ? formatNumberWithCommas(value.toString()) : "");

  React.useEffect(() => {
    if (value === 0) {
      setDisplayValue("");
    } else {
      const parsedDisplay = parseFormattedNumber(displayValue);
      if (parsedDisplay !== value) {
        setDisplayValue(formatNumberWithCommas(value.toString()));
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only digits
    if (rawValue === "") {
      setDisplayValue("");
      onChange(0);
      return;
    }
    
    const numValue = parseInt(rawValue, 10);
    if (!isNaN(numValue)) {
      setDisplayValue(formatNumberWithCommas(rawValue));
      onChange(numValue);
    }
  };

  return (
    <CustomInput
      {...props}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
    />
  );
}
