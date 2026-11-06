/**
 * Webhook Event Specifications & Payload Schemas
 */

export type WebhookEventType =
  | 'circulation.borrow'
  | 'circulation.return'
  | 'circulation.overdue'
  | 'reading_journey.goal_completed'
  | 'reading_journey.streak_milestone'
  | 'members.created'
  | 'members.tier_upgraded'
  | 'accounting.invoice_paid';

export interface BaseWebhookPayload<T> {
  id: string;
  event: WebhookEventType;
  timestamp: string;
  organizationId: string;
  data: T;
}

export interface CirculationBorrowPayload {
  loanId: string;
  memberId: string;
  memberName: string;
  bookId: string;
  bookTitle: string;
  barcode: string;
  issuedAt: string;
  dueDate: string;
}

export interface CirculationReturnPayload {
  loanId: string;
  memberId: string;
  bookId: string;
  returnedAt: string;
  daysLate: number;
  fineAmountCents: number;
}

export interface GoalCompletedPayload {
  userId: string;
  year: number;
  targetBooks: number;
  completedBooks: number;
  achievedAt: string;
}

export interface InvoicePaidPayload {
  invoiceId: string;
  memberId: string;
  amountCents: number;
  currency: string;
  paymentGateway: 'STRIPE' | 'PAYPAL';
  chargeId: string;
  paidAt: string;
}
