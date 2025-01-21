import { useEffect, useState } from 'react';
import { Input, InputBlock } from './ui/input';
import { motion } from 'framer-motion';
import {
  Select,
  SelectBlock,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button_v4 } from './ui/button-neubrutalism';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getInvoice, DelegasiError } from './services/delegasi.services';
import { InvoiceDetails } from './InvoiceDetails';
import { useInvoiceStore } from '@/store';
import { useSearchParams } from 'react-router-dom';

type Provider = {
  id: string;
  name: string;
};

const providers: Provider[] = [{ id: 'delegasi', name: 'Delegasi' }];

// Define the form schema using Zod
const paymentFormSchema = z.object({
  provider: z.string({
    required_error: 'Please select a provider',
  }),
  paymentNumber: z
    .string({
      required_error: 'Payment number is required',
    })
    .min(5, 'Payment number must be at least 5 characters'),
});

// Infer TypeScript type from Zod schema
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const PaymentForm = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { invoice, setInvoice } = useInvoiceStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      provider: '',
      paymentNumber: '',
    },
  });

  const paymentNumber = watch('paymentNumber');

  const handleProviderChange = (value: string) => {
    setValue('provider', value);
  };

  const handleClearNumber = () => {
    setValue('paymentNumber', '');
  };

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      const invoice = await getInvoice(data.paymentNumber);
      setInvoice(invoice);
    } catch (err) {
      console.error('Error fetching invoice:', err);

      if (err instanceof DelegasiError) {
        switch (err.code) {
          case 'INVOICE_NOT_FOUND':
            setError(
              'Nomor pembayaran tidak ditemukan. Mohon periksa kembali nomor pembayaran Anda.'
            );
            break;
          case 'INVOICE_ALREADY_PAID':
            setError(
              'Tagihan ini sudah dibayar. Silakan cek status pembayaran Anda.'
            );
            break;
          default:
            setError(
              'Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.'
            );
        }
      } else {
        setError(
          'Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill form based on URL parameters
  useEffect(() => {
    const paymentNumber = searchParams.get('payment_number');
    const provider = searchParams.get('provider');

    if (paymentNumber) {
      setValue('paymentNumber', paymentNumber);
    }

    if (provider) {
      setValue('provider', provider);
    }
  }, [searchParams, setValue]);

  const handleBack = () => {
    setInvoice(null);
    reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-zinc-50 dark:bg-zinc-900"
    >
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {invoice ? 'Invoice Details' : 'Payment Details'}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {invoice ? (
          <InvoiceDetails invoice={invoice} onBack={handleBack} />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm">
                {/* Provider Selection */}
                <div className="space-y-2 mb-6">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Penyedia
                  </label>
                  <SelectBlock variant="underlined">
                    <Select
                      onValueChange={handleProviderChange}
                      value={watch('provider')}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {providers.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </SelectBlock>
                  {errors.provider && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.provider.message}
                    </p>
                  )}
                </div>

                {/* Payment Number Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Nomor pembayaran
                  </label>
                  <InputBlock variant="underlined">
                    <Input
                      type="text"
                      {...register('paymentNumber')}
                      placeholder="12321"
                      aria-label="Payment number"
                    />
                    {paymentNumber && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClearNumber}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-full transition-colors"
                        aria-label="Clear payment number"
                      >
                        <svg
                          className="w-4 h-4 text-zinc-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </motion.button>
                    )}
                  </InputBlock>
                  {errors.paymentNumber && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.paymentNumber.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Button_v4
                type="submit"
                size="lg"
                className="w-full relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Memproses...</span>
                  </div>
                ) : (
                  'Lihat tagihan'
                )}
              </Button_v4>
            </div>

            {/* Info Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-sm space-y-6">
                <h2 className="font-medium text-zinc-900 dark:text-zinc-100">
                  Payment Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full p-1.5 mt-0.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-300">
                      <ol className="list-decimal list-inside space-y-1.5">
                        <li>
                          Dapatkan nomor pembayaran dari web atau app Paper.id.
                        </li>
                        <li>
                          Pembayaran tidak dapat dilakukan pukul 23.30-00.30
                          WIB.
                        </li>
                      </ol>
                    </div>
                  </div>

                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 font-medium text-sm"
                  >
                    Lihat halaman FAQ
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </motion.div>
  );
};
