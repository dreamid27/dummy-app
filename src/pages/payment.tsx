import { PaymentPage } from '@/pages/PaymentPage';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const router = useRouter();
  const { virtualAccount, bankName, amount } = router.query;

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
