import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/format';
import { Button_v4 } from './ui/button-neubrutalism';
import type { GetInvoiceProps } from './services/delegasi.services';
import { PaymentMethodModal } from './PaymentMethodModal';
import { useState } from 'react';

interface InvoiceDetailsProps {
  invoice: GetInvoiceProps;
  onBack: () => void;
}

export const InvoiceDetails = ({ invoice, onBack }: InvoiceDetailsProps) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePay = () => {
    setIsPaymentModalOpen(true);
  };

  const handleSelectPaymentMethod = async (methodId: string) => {
    setIsPaymentModalOpen(false);
    // TODO: Implement payment processing
    console.log(
      'Memproses pembayaran untuk invoice:',
      invoice.id,
      'dengan metode:',
      methodId
    );
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        className="max-w-3xl mx-auto bg-white dark:bg-zinc-800/95 rounded-xl shadow-lg backdrop-blur-sm p-8 space-y-8 border border-zinc-200 dark:border-zinc-700"
      >
        {/* Header dengan Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <motion.h2
              {...fadeInUp}
              className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50"
            >
              Detail Tagihan
            </motion.h2>
            <motion.p
              {...fadeInUp}
              className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400"
            >
              No. Invoice: {invoice.id}
            </motion.p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 text-xs md:text-sm rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Menunggu Pembayaran
            </span>
            <button
              onClick={onBack}
              className="p-1.5 md:p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors duration-200"
              aria-label="Kembali ke form pembayaran"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-zinc-500 dark:text-zinc-400"
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
            </button>
          </div>
        </div>

        {/* Info Penjual & Pembeli */}
        <motion.div
          {...fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-4 md:p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700"
        >
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-xs md:text-sm font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Informasi Penjual
            </h3>
            <div className="space-y-1">
              <p className="text-base md:text-lg font-medium text-zinc-900 dark:text-zinc-100">
                {invoice.merchant.name}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {invoice.merchant.phone_number}
              </p>
            </div>
          </div>
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-xs md:text-sm font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Informasi Pembeli
            </h3>
            <div className="space-y-1">
              <p className="text-base md:text-lg font-medium text-zinc-900 dark:text-zinc-100">
                {invoice.buyer.name}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2">
                <svg
                  className="w-3.5 h-3.5 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {invoice.buyer.phone_number}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Daftar Item */}
        <motion.div {...fadeInUp} className="space-y-3 md:space-y-4">
          <h3 className="text-xs md:text-sm font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Daftar Item
          </h3>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 divide-y dark:divide-zinc-700">
            {invoice.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 md:p-4 flex justify-between items-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
              >
                <span className="text-sm md:text-base text-zinc-900 dark:text-zinc-100 font-medium">
                  {item.description}
                </span>
                <span className="text-sm md:text-base text-zinc-900 dark:text-zinc-100 tabular-nums">
                  {formatCurrency(item.price)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Ringkasan Pembayaran */}
        <motion.div
          {...fadeInUp}
          className="relative space-y-4 md:space-y-6 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 md:p-6 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-800/50 dark:to-zinc-800/30"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs md:text-sm font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Ringkasan Pembayaran
            </h3>
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <svg
                className="w-3.5 h-3.5 md:w-4 md:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Pembayaran Aman
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between items-center py-1.5 md:py-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                  <span className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                    Subtotal
                  </span>
                </div>
                <span className="text-xs md:text-sm text-zinc-900 dark:text-zinc-100 font-medium tabular-nums">
                  {formatCurrency(invoice.amount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 md:py-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 dark:bg-emerald-500"></span>
                  <span className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                    Diskon
                  </span>
                </div>
                <span className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
                  - {formatCurrency(invoice.discount_amount)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 md:py-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                  <span className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                    Biaya Layanan
                  </span>
                </div>
                <span className="text-xs md:text-sm text-zinc-900 dark:text-zinc-100 font-medium tabular-nums">
                  {formatCurrency(invoice.total_fee)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5 md:py-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                  <span className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
                    Pembulatan
                  </span>
                </div>
                <span className="text-xs md:text-sm text-zinc-900 dark:text-zinc-100 font-medium tabular-nums">
                  {formatCurrency(invoice.rounded_amount)}
                </span>
              </div>
            </div>

            <div className="pt-3 md:pt-4 mt-2 border-t border-dashed border-zinc-200 dark:border-zinc-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-3 md:p-4 rounded-lg">
                <div className="space-y-0.5">
                  <span className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
                    Total Pembayaran
                  </span>
                  <p className="text-lg md:text-xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                    {formatCurrency(invoice.total_amount)}
                  </p>
                </div>
                <Button_v4
                  onClick={handlePay}
                  className="w-full md:w-auto px-4 md:px-6 py-2 md:py-2.5 text-sm font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-500/20"
                >
                  Bayar Sekarang
                </Button_v4>
              </div>
            </div>
          </div>

          {/* Visual Elements for Better UX */}
          <div className="absolute -left-2 md:-left-3 top-1/2 w-4 h-4 md:w-6 md:h-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute -right-2 md:-right-3 top-1/2 w-4 h-4 md:w-6 md:h-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full transform -translate-y-1/2"></div>
        </motion.div>
      </motion.div>

      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectMethod={handleSelectPaymentMethod}
        amount={invoice.total_amount}
      />
    </>
  );
};
