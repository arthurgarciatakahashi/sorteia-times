import { useEffect, useState } from 'react';
import { Switch, SwitchProps, FormControlLabel, FormHelperText } from '@mui/material';
import { useField } from '@unform/core';

type TVSwitchFieldProps = Omit<SwitchProps, 'name'> & {
  name: string;
  label: string;
};

export const VSwitchField: React.FC<TVSwitchFieldProps> = ({ name, label, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } = useField(name);

  const [checked, setChecked] = useState<boolean>(defaultValue || true);

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => checked,
      setValue: (_, newValue) => setChecked(!!newValue),
    });
  }, [registerField, fieldName, checked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setChecked(checked);
    if (rest.onChange) {
      rest.onChange(event, checked);
    }
  };

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            {...rest}
            checked={checked}
            onChange={handleChange}
            onKeyDown={(e) => { error && clearError(); rest.onKeyDown?.(e); }}
          />
        }
        label={label}
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
    </>
  );
};
