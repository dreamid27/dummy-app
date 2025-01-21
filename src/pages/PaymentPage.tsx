'use client';

import { PaymentInstructions } from '@/components/PaymentInstructions';
import { useNavigate } from 'react-router-dom';

interface PaymentPageProps {
  virtualAccount: string;
  bankName: string;
  amount: number;
}

export const PaymentPage = ({
  virtualAccount,
  bankName,
  amount,
}: PaymentPageProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pt-16">
      <PaymentInstructions
        virtualAccount={virtualAccount}
        bankName={bankName}
        amount={amount}
        onBack={handleBack}
      />
    </div>
  );
};
