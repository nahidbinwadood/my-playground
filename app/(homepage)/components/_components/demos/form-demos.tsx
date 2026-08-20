'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { useId, useState } from 'react';

const fieldLabel = 'font-mono text-xs uppercase tracking-[0.12em]';

export function InputDemo() {
  const id = useId();
  const [email, setEmail] = useState('');
  const touched = email.trim().length > 0;
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor={id} className={fieldLabel}>
        Work email
      </Label>
      <Input
        id={id}
        type="email"
        placeholder="you@studio.dev"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-invalid={touched && !valid}
        aria-describedby={`${id}-hint`}
      />
      <p
        id={`${id}-hint`}
        className="flex items-start gap-1.5 text-xs leading-relaxed"
      >
        {!touched ? (
          <span className="text-muted-foreground">
            Checked on every keystroke.
          </span>
        ) : valid ? (
          <>
            <CircleCheck
              aria-hidden="true"
              className="mt-px size-3.5 shrink-0 text-signal"
            />
            <span className="text-foreground">This address parses.</span>
          </>
        ) : (
          <>
            <CircleAlert
              aria-hidden="true"
              className="mt-px size-3.5 shrink-0 text-fail"
            />
            <span className="text-foreground">
              Needs an @ and a domain, like you@studio.dev.
            </span>
          </>
        )}
      </p>
    </div>
  );
}

export function TextareaDemo() {
  const id = useId();
  const [value, setValue] = useState('');
  const limit = 180;

  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor={id} className={fieldLabel}>
        Release note
      </Label>
      <Textarea
        id={id}
        rows={3}
        maxLength={limit}
        placeholder="What changed in this build?"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p className="text-right font-mono text-xs tabular-nums text-muted-foreground">
        {value.length}/{limit}
      </p>
    </div>
  );
}

export function SelectDemo() {
  const id = useId();

  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor={id} className={fieldLabel}>
        Post type
      </Label>
      <Select defaultValue="frontend">
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Pick a type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="font-mono text-xs tracking-tight">
              Categories
            </SelectLabel>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function CheckboxDemo() {
  const id = useId();
  const rows = [
    { value: 'required', label: 'Required field', defaultChecked: true },
    { value: 'trim', label: 'Trim whitespace', defaultChecked: true },
    { value: 'async', label: 'Check availability on the server' },
  ];

  return (
    <fieldset className="space-y-3">
      <legend className={`${fieldLabel} mb-3 text-muted-foreground`}>
        Validation rules
      </legend>
      {rows.map((row) => (
        <div key={row.value} className="flex items-center gap-3">
          <Checkbox
            id={`${id}-${row.value}`}
            defaultChecked={row.defaultChecked}
          />
          <Label htmlFor={`${id}-${row.value}`} className="font-normal">
            {row.label}
          </Label>
        </div>
      ))}
    </fieldset>
  );
}

export function RadioGroupDemo() {
  const id = useId();
  const options = [
    { value: 'onChange', label: 'On change' },
    { value: 'onBlur', label: 'On blur' },
    { value: 'onSubmit', label: 'On submit' },
  ];

  return (
    <fieldset className="space-y-3">
      <legend className={`${fieldLabel} mb-3 text-muted-foreground`}>
        Validation mode
      </legend>
      <RadioGroup defaultValue="onBlur" className="gap-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-3">
            <RadioGroupItem
              value={option.value}
              id={`${id}-${option.value}`}
            />
            <Label
              htmlFor={`${id}-${option.value}`}
              className="font-mono text-sm font-normal tracking-tight"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}

export function SwitchDemo() {
  const id = useId();
  const [strict, setStrict] = useState(true);

  return (
    <div className="w-full max-w-xs space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={`${id}-strict`} className="font-normal">
          Strict schema parsing
        </Label>
        <Switch
          id={`${id}-strict`}
          checked={strict}
          onCheckedChange={setStrict}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={`${id}-drafts`} className="font-normal">
          Keep unsaved drafts
        </Label>
        <Switch id={`${id}-drafts`} />
      </div>
      <p className="border-t border-line pt-3 font-mono text-xs text-muted-foreground">
        strict = {String(strict)}
      </p>
    </div>
  );
}

export function SliderDemo() {
  const [debounce, setDebounce] = useState([220]);

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <span className={`${fieldLabel} text-muted-foreground`}>Debounce</span>
        <span className="font-mono text-sm tabular-nums text-foreground">
          {debounce[0]} ms
        </span>
      </div>
      <Slider
        value={debounce}
        onValueChange={setDebounce}
        min={0}
        max={800}
        step={10}
        aria-label="Debounce in milliseconds"
      />
    </div>
  );
}
