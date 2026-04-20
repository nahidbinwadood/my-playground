import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash } from 'lucide-react';
interface IFormData {
  name: string;
  email: string;
  phone: { value: string }[];
}

const ContactCard = ({
  contact,
  onEdit,
  index,
  onDelete,
}: {
  contact: IFormData;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  index: number;
}) => {
  console.log('contact', contact);
  const primaryPhone =
    contact.phone && contact.phone.length ? contact.phone[0].value : '—';
  return (
    <Card className={`w-full max-w-md `}>
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <CardTitle className="text-sm leading-none">
              {contact.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {contact.email ?? 'No email'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit?.(index)}
            aria-label={`Edit ${contact.name}`}
          >
            <Edit size={16} />
          </Button>

          {/* Delete button */}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete?.(index)}
            aria-label={`Delete ${contact.name}`}
            className="text-destructive"
          >
            <Trash size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="grid grid-cols-1 gap-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Primary</span>
            <span>{primaryPhone}</span>
          </div>

          {contact.phone && contact.phone.length > 1 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground">
                Other numbers ({contact.phone.length - 1})
              </summary>
              <ul className="mt-2 space-y-1 pl-4">
                {contact.phone.slice(1).map((p, i) => (
                  <li key={i} className="text-sm">
                    {p.value}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
