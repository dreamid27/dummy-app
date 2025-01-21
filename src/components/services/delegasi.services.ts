import { v4 as uuidv4 } from 'uuid';

const BASE_URL = `https://sb.delegasi.co`;

const API_KEY = 'sw-c80fd210-8a28-4a98-b022-d2f655e8686a';
const API_SECRET = 'sw-284ac73a-713a-4854-b756-d9d39b5dfebb';

const generateSignature = async ({
  method,
  path,
  body = '',
  timestamp,
  apiKey,
  secretKey,
}: {
  method: string;
  path: string;
  body?: any;
  timestamp: string;
  apiKey: string;
  secretKey: string;
}) => {
  // Convert body object to string if it exists
  const bodyString = body ? JSON.stringify(body) : '';

  // Concatenate values
  const message = `${method.toUpperCase()}${path}${bodyString}${timestamp}${apiKey}`;

  // Convert message and secret to Uint8Array
  const encoder = new TextEncoder();
  const messageBuffer = encoder.encode(message);
  const secretBuffer = encoder.encode(secretKey);

  // Generate key
  const key = await crypto.subtle.importKey(
    'raw',
    secretBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign the message
  const signature = await crypto.subtle.sign('HMAC', key, messageBuffer);

  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export interface GetInvoiceProps {
  id: string;
  date: string;
  merchant: {
    name: string;
    phone_number: string;
  };
  buyer: {
    name: string;
    phone_number: string;
  };
  items: Array<{
    description: string;
    price: number;
  }>;
  created_at: string;
  updated_at: any;
  status: string;
  rounded_amount: number;
  discount_amount: number;
  total_fee: number;
  amount: number;
  total_amount: number;
  unique_code: string;
}

interface DelegasiErrorResponse {
  statusCode: number;
  code: string;
  message: string;
}

export class DelegasiError extends Error {
  statusCode: number;
  code: string;

  constructor(error: DelegasiErrorResponse) {
    super(error.message);
    this.statusCode = error.statusCode;
    this.code = error.code;
    this.name = 'DelegasiError';
  }
}

export const getInvoice = async (
  invoiceId: string
): Promise<GetInvoiceProps> => {
  const timestamp = new Date().toISOString();

  const signature = await generateSignature({
    method: 'GET',
    path: `/v1/payments/invoice/${invoiceId}`,
    timestamp,
    apiKey: API_KEY,
    secretKey: API_SECRET,
  });

  const headers = new Headers();
  headers.append('X-api-key', `${API_KEY}`);
  headers.append('X-Signature', signature);
  headers.append('X-Timestamp', timestamp);
  headers.append('Content-Type', 'application/json');

  const response = await fetch(`${BASE_URL}/v1/payments/invoice/${invoiceId}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorData: DelegasiErrorResponse = await response.json();
    throw new DelegasiError(errorData);
  }

  return response.json();
};

export const postWebhookBlibli = async (invoice: GetInvoiceProps) => {
  const body = {
    id: uuidv4(),
    reference_id: invoice.id,
    status: 'PAID',
    payment: {
      method: 'VIRTUAL_ACCOUNT',
      channel: 'BCA',
      amount: invoice.amount,
      fee_amount: invoice.total_fee,
      discount_amount: invoice.discount_amount,
      total_amount: invoice.total_amount,
      card_info: {
        masked_number: '4111-xxxx-xxxx-1111',
        brand: 'VISA',
        issuer: 'BCA',
        type: 'CREDIT',
      },
      approval_code: 'ABC123',
      transaction_date: new Date().toISOString(),
      status: 'SUCCESS',
      status_description: 'Payment successful',
    },
    buyer: {
      name: invoice.buyer.name,
      phone_number: invoice.buyer.phone_number,
    },
    merchant: {
      name: invoice.merchant.name,
      phone_number: invoice.merchant.phone_number,
    },
  };

  const timestamp = new Date().toISOString();

  const signature = await generateSignature({
    method: 'POST',
    path: `/webhook/blibli`,
    timestamp,
    apiKey: API_KEY,
    secretKey: API_SECRET,
    body,
  });

  const headers = new Headers();
  headers.append('X-api-key', `${API_KEY}`);
  headers.append('X-Signature', signature);
  headers.append('X-Timestamp', timestamp);
  headers.append('Content-Type', 'application/json');

  const response = await fetch(`${BASE_URL}/webhook/blibli`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData: DelegasiErrorResponse = await response.json();
    throw new DelegasiError(errorData);
  }

  return response.json();
};
