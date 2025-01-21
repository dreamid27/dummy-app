'use client';

import { motion } from 'framer-motion';
import { Button_v4 } from './ui/button-neubrutalism';
import {
  CheckCircle2,
  Copy,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { postWebhookBlibli } from './services/delegasi.services';
import { useInvoiceStore } from '@/store';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface PaymentInstructionsProps {
  virtualAccount: string;
  bankName: string;
  amount: number;
  onBack: () => void;
}

interface PaymentStep {
  title: string;
  steps: string[];
}

const bankInstructions: Record<string, PaymentStep[]> = {
  'BCA Virtual Account': [
    {
      title: 'ATM BCA',
      steps: [
        'Masukkan kartu ATM BCA & PIN',
        'Pilih menu "Transaksi Lainnya"',
        'Pilih menu "Transfer"',
        'Pilih menu "Ke Rek BCA Virtual Account"',
        `Masukkan nomor Virtual Account: {va_number}`,
        'Periksa informasi yang tertera di layar',
        'Jika informasi benar, pilih "Ya"',
      ],
    },
    {
      title: 'Mobile Banking BCA (m-BCA)',
      steps: [
        'Buka aplikasi BCA Mobile',
        'Pilih menu "m-BCA"',
        'Masukkan PIN m-BCA',
        'Pilih menu "m-Transfer"',
        'Pilih menu "BCA Virtual Account"',
        `Masukkan nomor Virtual Account: {va_number}`,
        'Masukkan PIN m-BCA untuk konfirmasi',
      ],
    },
    {
      title: 'Internet Banking BCA (KlikBCA)',
      steps: [
        'Login ke KlikBCA',
        'Pilih menu "Transfer Dana"',
        'Pilih menu "Transfer ke BCA Virtual Account"',
        `Masukkan nomor Virtual Account: {va_number}`,
        'Klik "Lanjutkan"',
        'Masukkan respon KeyBCA',
        'Periksa informasi yang tertera',
        'Jika informasi benar, klik "Kirim"',
      ],
    },
  ],
  'Mandiri Virtual Account': [
    {
      title: 'ATM Mandiri',
      steps: [
        'Masukkan kartu ATM Mandiri & PIN',
        'Pilih menu "Bayar/Beli"',
        'Pilih menu "Multipayment"',
        `Masukkan kode perusahaan: {company_code}`,
        `Masukkan nomor Virtual Account: {va_number}`,
        'Periksa informasi yang tertera di layar',
        'Jika informasi benar, pilih "Ya"',
      ],
    },
    {
      title: 'Mandiri Online',
      steps: [
        'Login ke aplikasi Mandiri Online',
        'Pilih menu "Pembayaran"',
        'Pilih menu "Multipayment"',
        'Pilih penyedia jasa "Virtual Account"',
        `Masukkan nomor Virtual Account: {va_number}`,
        'Periksa informasi pembayaran',
        'Masukkan MPIN untuk konfirmasi',
      ],
    },
  ],
  // Add other banks...
};

export const PaymentInstructions = ({
  virtualAccount,
  bankName,
  onBack,
}: PaymentInstructionsProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const { invoice } = useInvoiceStore();

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showSuccessNotification = () => {
    toast.success('Pembayaran Anda telah dikonfirmasi.');
  };

  const handlePaymentConfirmation = async () => {
    try {
      if (!invoice) return;

      setIsLoading(true);
      await postWebhookBlibli(invoice);
      setIsSuccess(true);
      showSuccessNotification();
      navigate('/');
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error('Terjadi kesalahan saat memproses permintaan Anda.', {
        description: 'Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const instructions = bankInstructions[bankName];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-6"
    >
      <div className="py-4">
        {/* Back Button */}
        <Button_v4 onClick={onBack} variant="default">
          <span>Kembali ke Metode Pembayaran</span>
        </Button_v4>
      </div>

      {/* Payment Status Card */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 mb-6 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Detail Pembayaran
          </h2>
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full',
              isSuccess
                ? 'text-green-600 bg-green-50 dark:bg-green-900/20'
                : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
            )}
          >
            {isSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Pembayaran Dikonfirmasi
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Menunggu Pembayaran</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center py-4 border-b border-zinc-100 dark:border-zinc-700">
            <span className="text-zinc-500 dark:text-zinc-400">
              Jumlah Pembayaran
            </span>
            <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {formatCurrency(invoice?.total_amount || 0)}
            </span>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-zinc-100 dark:border-zinc-700">
            <span className="text-zinc-500 dark:text-zinc-400">
              Metode Pembayaran
            </span>
            <span className="text-zinc-900 dark:text-zinc-100">{bankName}</span>
          </div>

          <div className="flex justify-between items-center py-4">
            <span className="text-zinc-500 dark:text-zinc-400">
              Nomor Virtual Account
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg text-zinc-900 dark:text-zinc-100">
                {virtualAccount}
              </span>
              <Button_v4
                onClick={() => handleCopy(virtualAccount)}
                variant="ghost"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                  </>
                )}
              </Button_v4>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {instructions?.map((method, index) => (
          <button
            key={index}
            onClick={() => setSelectedMethod(index)}
            className={cn(
              'px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors',
              selectedMethod === index
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            )}
          >
            {method.title}
          </button>
        ))}
      </div>

      {/* Payment Instructions */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 mb-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="text-lg font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
          {instructions?.[selectedMethod]?.title || 'Cara Pembayaran'}
        </h3>

        <ol className="space-y-4">
          {instructions?.[selectedMethod]?.steps.map((step, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 pt-1">
                {step.replace('{va_number}', virtualAccount)}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 mb-6 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h4 className="text-amber-800 dark:text-amber-200 font-medium">
            Catatan Penting:
          </h4>
        </div>
        <ul className="space-y-3 text-amber-700 dark:text-amber-300 text-sm ml-7 list-disc">
          <li>Selesaikan pembayaran dalam 24 jam</li>
          <li>Transfer sesuai dengan jumlah yang tertera</li>
          <li>Nomor Virtual Account unik untuk transaksi ini</li>
          <li>Simpan bukti pembayaran hingga transaksi selesai</li>
          <li>Konfirmasi pembayaran akan diproses dalam 5-10 menit</li>
        </ul>
      </div>

      {/* Confirmation Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="sticky bottom-6"
      >
        <Button_v4
          onClick={handlePaymentConfirmation}
          className="w-full"
          disabled={isLoading || isSuccess}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Pembayaran Dikonfirmasi
            </>
          ) : (
            'Saya Sudah Bayar'
          )}
        </Button_v4>
      </motion.div>
    </motion.div>
  );
};
