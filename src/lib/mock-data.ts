
export type Organization = {
  id: string;
  name: string;
  logoUrl: string;
  email: string;
  paymentGatewayKey: string;
};

export type Client = {
  id: string;
  orgId: string;
  name: string;
  email: string;
  address: string;
};

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
};

export type Invoice = {
  id: string;
  orgId: string;
  clientId: string;
  number: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  total: number;
};

export const MOCK_ORG: Organization = {
  id: 'org_123',
  name: 'Acme Solutions Inc.',
  logoUrl: 'https://picsum.photos/seed/org1/200/200',
  email: 'billing@acme.com',
  paymentGatewayKey: 'sk_test_51Mz...',
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'client_1',
    orgId: 'org_123',
    name: 'Globex Corporation',
    email: 'finance@globex.com',
    address: '123 Power Plant Rd, Springfield',
  },
  {
    id: 'client_2',
    orgId: 'org_123',
    name: 'Initech LLC',
    email: 'ap@initech.com',
    address: '4120 Freidrich Lane, Austin',
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_1',
    orgId: 'org_123',
    clientId: 'client_1',
    number: 'INV-2024-001',
    issueDate: '2024-05-01',
    dueDate: '2024-05-15',
    items: [
      { id: 'item_1', description: 'Monthly Cloud Subscription', quantity: 1, price: 1200 },
      { id: 'item_2', description: 'Technical Support (Hours)', quantity: 5, price: 150 }
    ],
    taxRate: 8,
    status: 'Paid',
    total: 2106
  },
  {
    id: 'inv_2',
    orgId: 'org_123',
    clientId: 'client_2',
    number: 'INV-2024-002',
    issueDate: '2024-05-10',
    dueDate: '2024-05-24',
    items: [
      { id: 'item_3', description: 'Software Consulting', quantity: 10, price: 200 }
    ],
    taxRate: 5,
    status: 'Pending',
    total: 2100
  }
];
