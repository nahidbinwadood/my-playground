'use client';

import FormNumberInput from '@/components/forms/shadcn/form-number-input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import CommonAlertModal from '@/components/modal/common-alert-modal';
import { tieredRateSchema, TieredRateFormValues } from './schema';

const TieredRateForm = () => {
  // const rewards: any = [
  //   {
  //     spendFrom: 20,
  //     points: 100,
  //   },
  //   {
  //     spendFrom: 20,
  //     points: 100,
  //   },
  //   {
  //     spendFrom: 20,
  //     points: 100,
  //   },
  // ];

  const [open, setOpen] = useState<boolean>(false);
  const [selectedTierIndex, setSelectedTierIndex] = useState<null | number>(
    null
  );
  const rewards: any = [];
  const form = useForm<TieredRateFormValues>({
    defaultValues: {
      rates: !!rewards?.length
        ? rewards
        : [{ spendFrom: undefined, points: undefined }],
    },
    mode: 'onChange',
    resolver: zodResolver(tieredRateSchema),
  });

  void form.formState.errors; // subscribe so errors render after trigger()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rates',
  });

  const onSubmit = (data: TieredRateFormValues) => {
    try {
      console.log('Tiered Rates:', data);
      toast.success('Tiered rates saved successfully!');
      form.reset({ rates: [{ spendFrom: undefined, points: undefined }] });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold">Tiered Rates</h4>
            <span className="text-sm text-muted-foreground">
              {fields.length} / 4 tiers
            </span>
          </div>

          <div className="space-y-4 ">
            {fields.map((field, index) => (
              <div className="flex items-center gap-5" key={field.id}>
                <FormNumberInput
                  className="w-full"
                  name={`rates.${index}.spendFrom`}
                  label="Spend From ($)"
                  control={form.control}
                  placeholder="e.g. 100"
                  required
                  integerOnly
                />
                <FormNumberInput
                  className="w-full"
                  name={`rates.${index}.points`}
                  label="Points"
                  control={form.control}
                  placeholder="e.g. 100"
                  required
                  integerOnly
                />

                {fields?.length > 1 ? (
                  <Button
                    onClick={() => {
                      setOpen(true);
                      setSelectedTierIndex(index);
                    }}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive mt-5"
                  >
                    <Trash />
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={fields.length >= 4}
            onClick={async () => {
              const valid = await form.trigger('rates');

              if (!valid) return;

              append({
                spendFrom: undefined as unknown as number,
                points: undefined as unknown as number,
              });
            }}
          >
            <Plus size={16} className="mr-2" />
            Add Rate
          </Button>

          <Button type="submit" className="w-full">
            Save Tiered Rates
          </Button>
        </form>
      </Form>

      {/* Confirmation Modal */}
      <CommonAlertModal
        open={open}
        setOpen={setOpen}
        title={`Delete Tier ${(selectedTierIndex as number) + 1}?`}
        description={` This will remove Tier ${(selectedTierIndex as number) + 1} and cannot be undone.`}
        onCancel={() => {
          setSelectedTierIndex(null);
        }}
        onConfirm={() => {
          remove(selectedTierIndex as number);
          setSelectedTierIndex(null);
        }}
      />
    </>
  );
};

export default TieredRateForm;
