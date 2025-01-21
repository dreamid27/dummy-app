import { PaymentPage } from '@/pages/PaymentPage';
import { useSearchParams } from 'react-router-dom';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const virtualAccount = searchParams.get('virtual_account');
  const bankName = searchParams.get('bank_name');
  const amount = searchParams.get('amount');

  if (!virtualAccount || !bankName || !amount) {
    return null; // or show loading/error state
  }

  return (
    <PaymentPage
      virtualAccount={virtualAccount as string}
      bankName={bankName as string}
      amount={Number(amount)}
    />
  );
}
