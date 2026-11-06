/**
 * Definitions for 7 SaaS Modules & Premium Features
 */

// Module 1: Catalog
export interface CatalogItem {
  id: string;
  tenantId: string;
  branchId?: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  locationShelf: string;
}

// Module 2: Circulation
export type LoanStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'LOST' | 'CLAIMED_RETURN';
export interface CirculationLoan {
  id: string;
  tenantId: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  issuedAt: string;
  dueDate: string;
  returnedAt?: string;
  renewalCount: number;
  fineAmountCents: number;
  status: LoanStatus;
}

// Module 3: Members
export interface LibraryMember {
  id: string;
  tenantId: string;
  branchId: string;
  departmentId?: string;
  fullName: string;
  email: string;
  cardNumber: string;
  status: 'ACTIVE' | 'EXPIRED' | 'BLOCKED';
  joinedDate: string;
  activeLoansCount: number;
  tier: 'Standard' | 'Scholar' | 'Faculty' | 'VIP';
}

// Module 4: Reading Journeys & Premium Suite
export interface ReadingGoal {
  id: string;
  userId: string;
  tenantId: string;
  year: number;
  targetBooks: number;
  completedBooks: number;
  totalPagesRead: number;
  currentStreakDays: number;
  longestStreakDays: number;
}

export interface ReadingStreak {
  currentStreakDays: number;
  longestStreakDays: number;
  lastActiveDate: string;
  streakFreezeRemaining: number;
}

export interface AchievementBadge {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  unlockedAt?: string;
}

export interface BookClub {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  currentBookTitle: string;
  membersCount: number;
  nextMeetingDate: string;
  discussionTopic: string;
}

export interface ReadingChallenge {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participantsCount: number;
  targetBookCount: number;
  rewardBadgeCode: string;
}

// Module 5: Analytics
export interface CirculationMetric {
  date: string;
  checkouts: number;
  returns: number;
  newMembers: number;
  revenueCents: number;
}

// Module 6: Accounting
export interface Invoice {
  id: string;
  tenantId: string;
  memberId?: string;
  recipientName: string;
  amountCents: number;
  currency: 'USD' | 'EUR' | 'GBP';
  status: 'PAID' | 'OPEN' | 'VOID' | 'REFUNDED';
  type: 'MEMBERSHIP_FEE' | 'LATE_FINE' | 'BOOK_PURCHASE' | 'ENTERPRISE_LICENSE';
  createdAt: string;
  paidAt?: string;
}

// Module 7: Integrations
export interface IntegrationConnector {
  id: string;
  type: 'STRIPE' | 'PAYPAL' | 'SENDGRID' | 'SES' | 'SALESFORCE' | 'HUBSPOT' | 'GOOGLE_CALENDAR' | 'OUTLOOK';
  name: string;
  isEnabled: boolean;
  status: 'HEALTHY' | 'ERROR' | 'UNCONFIGURED';
  lastSyncAt?: string;
}
