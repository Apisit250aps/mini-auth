'use client';

import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Eye, EyeClosed } from 'lucide-react';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

const numberParse = (value: string) => {
  if (value === '') return undefined;
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
};

export type BaseFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: React.ReactNode;
  labelAccessory?: React.ReactNode;
  description?: React.ReactNode;
};

export type InputFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<React.ComponentProps<'input'>, 'name' | 'defaultValue'>;

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  id: customId,
  onChange: customOnChange,
  ...props
}: InputFieldProps<T>): React.ReactElement => {
  const id = customId || `form-rhf-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {(label || labelAccessory) && (
            <div className="flex w-full items-center justify-between">
              {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
              {labelAccessory}
            </div>
          )}
          <Input
            {...field}
            id={id}
            aria-invalid={fieldState.invalid}
            {...props}
            value={field.value ?? ''}
            onChange={(e) => {
              if (props.type === 'number') {
                field.onChange(numberParse(e.target.value));
              } else {
                field.onChange(e);
              }
              customOnChange?.(e);
            }}
          />
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export type PasswordFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<React.ComponentProps<'input'>, 'name' | 'defaultValue' | 'type'>;

const PasswordField = <T extends FieldValues>({
  control,
  name,
  label,
  labelAccessory,
  description,
  id: customId,
  onChange: customOnChange,
  ...props
}: PasswordFieldProps<T>): React.ReactElement => {
  const [showPassword, setShowPassword] = React.useState(false);
  const id = customId || `form-rhf-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {(label || labelAccessory) && (
            <div className="flex w-full items-center justify-between">
              {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
              {labelAccessory}
            </div>
          )}
          <InputGroup>
            <InputGroupInput
              {...props}
              {...field}
              id={id}
              type={showPassword ? 'text' : 'password'}
              aria-invalid={fieldState.invalid}
              value={field.value ?? ''}
              onChange={(e) => {
                field.onChange(e);
                customOnChange?.(e);
              }}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export { InputField, PasswordField };
