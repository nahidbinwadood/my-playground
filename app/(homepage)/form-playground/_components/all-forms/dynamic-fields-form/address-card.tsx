import { Button } from '@/components/ui/button';
import React from 'react';
import { DynamicFieldsFormValues } from './schema';
interface IAddressCardProps {
  address: DynamicFieldsFormValues['address'][0];
  onEdit: () => void;
  onDelete?: () => void;
}

const AddressCard: React.FC<IAddressCardProps> = ({
  address,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="p-4 border rounded-md shadow-md flex justify-between items-start">
      <div>
        <p>
          <strong>Street:</strong> {address.street}
        </p>
        <p>
          <strong>City:</strong> {address.city}
        </p>
        <p>
          <strong>State:</strong> {address.state}
        </p>
        <p>
          <strong>Zip Code:</strong> {address.zipCode}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Button size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AddressCard;
