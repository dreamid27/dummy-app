import { create } from 'zustand';
import { GetInvoiceProps } from '../components/services/delegasi.services';

// Define the Zustand store
interface InvoiceStore {
  invoice: GetInvoiceProps | null;
  setInvoice: (invoice: GetInvoiceProps | null) => void;
  clearInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoice: null,
  setInvoice: (invoice) => set({ invoice }),
  clearInvoice: () => set({ invoice: null }),
}));
