import { useState } from 'react';
import AddressCard from './address-card';
import DynamicFieldsForm from './dynamic-fields-form';
import { DynamicFieldsFormValues } from './schema';

const DynamicFieldsFormWrapper = () => {
  const [allAddress, setAllAddress] = useState<
    DynamicFieldsFormValues['address']
  >([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(!allAddress?.length);

  // form submit handlers==>
  const handlerFormSubmit = async (data: DynamicFieldsFormValues) => {
    try {
      if (editingIndex === null) {
        const allAddress = data?.address;
        setAllAddress([...allAddress]);
        setShowForm(false);
      } else {
        const prevAddress = [...allAddress];
        prevAddress[editingIndex] = data?.address[0];
        setAllAddress([...prevAddress]);
        setEditingIndex(null);
        setShowForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // edit handlers==>
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  //  delete handlers==>
  const handleDelete = (index: number) => {
    const updatedAddress = allAddress?.filter(
      (_, idx: number) => idx !== index
    );
    setAllAddress([...updatedAddress]);

    if (allAddress?.length == 1) {
      setShowForm(true);
    }
    return;
  };

  return (
    <section>
      {showForm ? (
        <DynamicFieldsForm
          defaultValues={
            editingIndex !== null ? [allAddress[editingIndex]] : undefined
          }
          onSubmit={handlerFormSubmit}
        />
      ) : (
        <div className="space-y-4">
          {allAddress.map((address, index) => (
            <AddressCard
              key={index}
              address={address}
              onEdit={() => handleEdit(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default DynamicFieldsFormWrapper;
