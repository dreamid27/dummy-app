import { PaymentInstructions } from '@/components/PaymentInstructions';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const virtualAccount = searchParams.get('virtualAccount') || '';
  const bankName = searchParams.get('bankName') || '';
  const amount = Number(searchParams.get('amount')) || 0;

  const handleBack = () => {
    navigate(-1);
  };

  if (!virtualAccount || !bankName || !amount) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Invalid Payment Data
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Please try again from the payment form.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <PaymentInstructions
        virtualAccount={virtualAccount}
        bankName={bankName}
        amount={amount}
        onBack={handleBack}
      />
    </div>
  );
};
