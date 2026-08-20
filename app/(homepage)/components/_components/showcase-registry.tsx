import type { ReactNode } from 'react';
import {
  BadgeDemo,
  ButtonStateDemo,
  ButtonVariantsDemo,
  DropdownMenuDemo,
  ToggleGroupDemo,
} from './demos/action-demos';
import {
  AvatarDemo,
  CalendarDemo,
  ProgressDemo,
  SkeletonDemo,
  TableDemo,
} from './demos/data-demos';
import { AccordionDemo, TabsDemo } from './demos/disclosure-demos';
import {
  CheckboxDemo,
  InputDemo,
  RadioGroupDemo,
  SelectDemo,
  SliderDemo,
  SwitchDemo,
  TextareaDemo,
} from './demos/form-demos';
import {
  AlertDialogDemo,
  DialogDemo,
  HoverCardDemo,
  PopoverDemo,
  TooltipDemo,
} from './demos/overlay-demos';
import {
  FeatureCardDemo,
  PricingCardDemo,
  StatCardDemo,
  TestimonialCardDemo,
} from './demos/pattern-demos';

export type SpecimenEntry = {
  id: string;
  name: string;
  source: string;
  note?: string;
  wide?: boolean;
  demo: ReactNode;
};

export type SpecimenGroup = {
  id: string;
  name: string;
  blurb: string;
  items: SpecimenEntry[];
};

export const specimenGroups: SpecimenGroup[] = [
  {
    id: 'actions',
    name: 'Actions',
    blurb:
      'Anything that commits a change or opens a menu. Click them — the loading button really waits.',
    items: [
      {
        id: 'button-variants',
        name: 'Button',
        source: 'components/ui/button.tsx',
        note: 'Six variants. Each one keeps the same height and focus ring.',
        demo: <ButtonVariantsDemo />,
      },
      {
        id: 'button-states',
        name: 'Button — sizes and states',
        source: 'components/ui/button.tsx',
        note: 'Press "Save draft" to see the loading state swap in the label.',
        demo: <ButtonStateDemo />,
      },
      {
        id: 'toggle-group',
        name: 'ToggleGroup',
        source: 'components/ui/toggle-group.tsx',
        note: 'Single-select. Arrow keys move between items.',
        demo: <ToggleGroupDemo />,
      },
      {
        id: 'dropdown-menu',
        name: 'DropdownMenu',
        source: 'components/ui/dropdown-menu.tsx',
        note: 'Items, a checkbox item, shortcuts, and a destructive action.',
        demo: <DropdownMenuDemo />,
      },
      {
        id: 'badge',
        name: 'Badge',
        source: 'components/ui/badge.tsx',
        note: 'Below: the status tag used across the admin tables.',
        demo: <BadgeDemo />,
      },
    ],
  },
  {
    id: 'inputs',
    name: 'Inputs',
    blurb:
      'The form layer. Type in the email field and the state readout updates on every keystroke.',
    items: [
      {
        id: 'input',
        name: 'Input',
        source: 'components/ui/input.tsx',
        note: 'Invalid state is driven by aria-invalid, not a class.',
        demo: <InputDemo />,
      },
      {
        id: 'textarea',
        name: 'Textarea',
        source: 'components/ui/textarea.tsx',
        note: 'Grows with its content up to the character limit.',
        demo: <TextareaDemo />,
      },
      {
        id: 'select',
        name: 'Select',
        source: 'components/ui/select.tsx',
        note: 'The same three post types the blog CMS writes.',
        demo: <SelectDemo />,
      },
      {
        id: 'checkbox',
        name: 'Checkbox',
        source: 'components/ui/checkbox.tsx',
        note: 'Labels are clickable targets, not decoration.',
        demo: <CheckboxDemo />,
      },
      {
        id: 'radio-group',
        name: 'RadioGroup',
        source: 'components/ui/radio-group.tsx',
        note: 'One choice per group; arrow keys move the selection.',
        demo: <RadioGroupDemo />,
      },
      {
        id: 'switch',
        name: 'Switch',
        source: 'components/ui/switch.tsx',
        note: 'Controlled on the left, uncontrolled on the right.',
        demo: <SwitchDemo />,
      },
      {
        id: 'slider',
        name: 'Slider',
        source: 'components/ui/slider.tsx',
        note: 'Drag it, or focus the thumb and use the arrow keys.',
        demo: <SliderDemo />,
      },
    ],
  },
  {
    id: 'overlays',
    name: 'Overlays',
    blurb:
      'Layers that trap focus or follow a trigger. Escape closes every one of them.',
    items: [
      {
        id: 'dialog',
        name: 'Dialog',
        source: 'components/ui/dialog.tsx',
        note: 'Focus moves into the field and returns to the trigger on close.',
        demo: <DialogDemo />,
      },
      {
        id: 'alert-dialog',
        name: 'AlertDialog',
        source: 'components/ui/alert-dialog.tsx',
        note: 'For destructive steps: no click-outside dismissal.',
        demo: <AlertDialogDemo />,
      },
      {
        id: 'popover',
        name: 'Popover',
        source: 'components/ui/popover.tsx',
        note: 'Holds real controls, so it stays open while you use them.',
        demo: <PopoverDemo />,
      },
      {
        id: 'tooltip',
        name: 'Tooltip',
        source: 'components/ui/tooltip.tsx',
        note: 'Opens on hover and on keyboard focus.',
        demo: <TooltipDemo />,
      },
      {
        id: 'hover-card',
        name: 'HoverCard',
        source: 'components/ui/hover-card.tsx',
        note: 'For preview content that is not worth a click.',
        demo: <HoverCardDemo />,
      },
    ],
  },
  {
    id: 'disclosure',
    name: 'Disclosure',
    blurb: 'Two ways to hide content until it is asked for.',
    items: [
      {
        id: 'tabs',
        name: 'Tabs',
        source: 'components/ui/tabs.tsx',
        note: 'Only the active panel is mounted in the accessibility tree.',
        demo: <TabsDemo />,
      },
      {
        id: 'accordion',
        name: 'Accordion',
        source: 'components/ui/accordion.tsx',
        note: 'Single mode, collapsible: the open item can be closed again.',
        demo: <AccordionDemo />,
      },
    ],
  },
  {
    id: 'data',
    name: 'Data display',
    blurb: 'What the admin side is built out of: rows, meters, dates, and the placeholder that stands in while they load.',
    items: [
      {
        id: 'table',
        name: 'Table',
        source: 'components/ui/table.tsx',
        note: 'Header row sits on the recessed surface; ids stay tabular.',
        wide: true,
        demo: <TableDemo />,
      },
      {
        id: 'progress',
        name: 'Progress',
        source: 'components/ui/progress.tsx',
        note: 'Step the value to watch the bar and readout move together.',
        demo: <ProgressDemo />,
      },
      {
        id: 'avatar',
        name: 'Avatar',
        source: 'components/ui/avatar.tsx',
        note: 'Initials render when there is no image to load.',
        demo: <AvatarDemo />,
      },
      {
        id: 'calendar',
        name: 'Calendar',
        source: 'components/ui/calendar.tsx',
        note: 'Pick a day; month navigation works from the keyboard.',
        demo: <CalendarDemo />,
      },
      {
        id: 'skeleton',
        name: 'Skeleton',
        source: 'components/ui/skeleton.tsx',
        note: 'Shaped like the blog card it replaces, down to the meta row.',
        demo: <SkeletonDemo />,
      },
    ],
  },
  {
    id: 'patterns',
    name: 'Composed patterns',
    blurb:
      'Primitives assembled into the cards this site actually ships.',
    items: [
      {
        id: 'pricing-card',
        name: 'Pricing card',
        source: 'components/ui/card.tsx',
        note: 'Price is mono and tabular so digits line up between plans.',
        demo: <PricingCardDemo />,
      },
      {
        id: 'stat-card',
        name: 'Stat card',
        source: 'components/common/stats-card.tsx',
        note: 'One number, one delta, one unit of context.',
        demo: <StatCardDemo />,
      },
      {
        id: 'feature-card',
        name: 'Feature card',
        source: 'components/home/features-section.tsx',
        note: 'Neutral icon well — the accent budget is spent elsewhere.',
        demo: <FeatureCardDemo />,
      },
      {
        id: 'testimonial-card',
        name: 'Testimonial card',
        source: 'components/ui/card.tsx',
        note: 'Quote first, attribution below a hairline rule.',
        demo: <TestimonialCardDemo />,
      },
    ],
  },
];

// Stable list for the sticky index, built once at module scope.
export const specimenNavGroups = specimenGroups.map((group) => ({
  id: group.id,
  name: group.name,
  count: group.items.length,
}));

export const specimenCount = specimenGroups.reduce(
  (total, group) => total + group.items.length,
  0
);
