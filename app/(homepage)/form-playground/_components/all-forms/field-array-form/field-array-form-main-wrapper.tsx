import { useState } from 'react';
import { toast } from 'sonner';
import ContactCard from './contact-card';
import FieldArrayForm from './field-array-form';
import { FieldArrayFormValues } from './schema';

interface IFormData {
  name: string;
  email: string;
  phone: { value: string }[];
}

const FieldArrayFormMainWrapper = () => {
  // all form data==>
  const [allData, setAllData] = useState<IFormData[] | []>([]);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<IFormData[] | null>(null);

  // submit handlers==>

  const onSubmit = (data: FieldArrayFormValues) => {
    try {
      const newData = data?.contacts;

      if (selectedIndex !== null) {
        toast.success('Form updated successfully !');
        const updatedData = allData?.map((item, idx) =>
          idx == selectedIndex ? newData[0] : item
        );

        setAllData([...updatedData]);
        setShowForm(false);
        setSelectedIndex(null);
        setFormData(null);
      } else {
        toast.success('Form submitted successfully !');
        setAllData((prev) => [...prev, ...newData]);
        setShowForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // delete handlers==>
  const handleDelete = (index: number) => {
    try {
      const updatedData = allData?.filter((_, idx) => idx !== index);

      if (updatedData.length > 0) {
        setSelectedIndex(null);
        setAllData([...updatedData]);
      } else {
        setShowForm(true);
        setSelectedIndex(null);
        setAllData([...updatedData]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // edit handlers==>
  const handleEdit = (index: number) => {
    setSelectedIndex(index);
    setFormData([allData[index]]);
    setShowForm(true);
  };

  return (
    <section>
      {!showForm ? (
        <div>
          <h4 className="text-lg font-semibold mb-2">All Contacts</h4>
          <div className="space-y-4 grid grid-cols-2 gap-4">
            {allData?.map((contact: IFormData, idx) => (
              <ContactCard
                key={idx}
                contact={contact}
                index={idx}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      ) : (
        <FieldArrayForm onSubmit={onSubmit} formData={formData} />
      )}
    </section>
  );
};

export default FieldArrayFormMainWrapper;
