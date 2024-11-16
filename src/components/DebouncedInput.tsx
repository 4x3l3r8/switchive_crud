"use client"
import { Search } from "@mui/icons-material";
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, OutlinedInputProps } from "@mui/material";
import { useState, useMemo, FC } from "react";
import { useDebouncedCallback } from "use-debounce";

interface DebounceInputProps extends OutlinedInputProps {
  debounce?: number;
  value: string | number | string[];
}

export const DebouncedInput: FC<DebounceInputProps> = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue || "");
  const debouncedCallback = useDebouncedCallback(onChange ? (value) => onChange(value) : () => null, debounce);

  useMemo(() => setValue(initialValue), [initialValue]);

  return (
    <FormControl sx={{ m: 1, width: '25ch' }} size="small" variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel>
      <OutlinedInput
        type={'text'}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          debouncedCallback(e.target.value);
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                'Search'
              }
              edge="end"
            >
              <Search />
            </IconButton>
          </InputAdornment>
        }
        label="Password"
        {...props}
      />
    </FormControl>
  );
};
