import { motion } from 'framer-motion';
import { Button_v4 } from './ui/button-neubrutalism';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from './ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useNavigate } from 'react-router-dom';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bca_va',
    name: 'BCA Virtual Account',
    icon: '🏦',
    description: 'Pay via BCA Virtual Account',
  },
  {
    id: 'mandiri_va',
    name: 'Mandiri Virtual Account',
    icon: '🏦',
    description: 'Pay via Mandiri Virtual Account',
  },
  {
    id: 'bni_va',
    name: 'BNI Virtual Account',
    icon: '🏦',
    description: 'Pay via BNI Virtual Account',
  },
  {
    id: 'bri_va',
    name: 'BRI Virtual Account',
    icon: '🏦',
    description: 'Pay via BRI Virtual Account',
  },
];

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (methodId: string) => void;
  amount: number;
}

export const PaymentMethodModal = ({
  isOpen,
  onClose,
  onSelectMethod,
  amount,
}: PaymentMethodModalProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const navigate = useNavigate();

  const handleMethodSelect = (methodId: string) => {
    onSelectMethod(methodId);
    onClose();

    // Navigate to payment page with the selected method
    const selectedBank = paymentMethods.find(
      (method) => method.id === methodId
    );

    // Use URLSearchParams to properly encode the parameters
    const params = new URLSearchParams({
      virtualAccount: '1234567890', // This should come from your backend
      bankName: selectedBank?.name || '',
      amount: amount.toString(),
    });

    navigate(`/payment?${params.toString()}`);
  };

  const PaymentMethodsList = () => (
    <div className="p-6 space-y-4">
      {paymentMethods.map((method) => (
        <motion.button
          key={method.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMethodSelect(method.id)}
          className="w-full p-4 flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-colors"
        >
          <span className="text-2xl">{method.icon}</span>
          <div className="flex-1 text-left">
            <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
              {method.name}
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {method.description}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Select Payment Method
            </DialogTitle>
          </DialogHeader>

          <PaymentMethodsList />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Select Payment Method
          </DrawerTitle>
        </DrawerHeader>

        <PaymentMethodsList />

        <DrawerFooter>
          <Button_v4 onClick={onClose} className="w-full">
            Cancel
          </Button_v4>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
