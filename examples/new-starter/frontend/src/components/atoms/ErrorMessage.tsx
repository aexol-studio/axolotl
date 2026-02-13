import { Alert, AlertDescription } from '@/components/ui/Alert';

type ErrorMessageProps = {
  message: string | null;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
