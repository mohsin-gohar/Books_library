import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
  address: string;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (bookId: string, bookTitle: string, quantity?: number, address?: string) => Order | null;
  updateStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  userOrders: Order[];
  allOrders: Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const STORAGE_KEY = 'athenaeum_orders';

const seedOrders: Order[] = [
  {
    id: 'ord-171201',
    userId: 'user-sample-1',
    userName: 'Elena Rostova',
    bookId: 'arch-1',
    bookTitle: 'Complexity and Contradiction in Architecture',
    quantity: 1,
    status: 'Delivered',
    createdAt: '2025-02-18 14:22',
    address: '42 Belgrave Square, London SW1X 8PG, UK'
  },
  {
    id: 'ord-171202',
    userId: 'user-sample-2',
    userName: 'Dr. Tariq Mansoor',
    bookId: 'phil-1',
    bookTitle: 'The Courage of Truth',
    quantity: 2,
    status: 'Shipped',
    createdAt: '2025-02-21 09:15',
    address: '88 Avenue Victor Hugo, 75116 Paris, France'
  },
  {
    id: 'ord-171203',
    userId: 'user-sample-3',
    userName: 'Sophia Chen',
    bookId: 'sci-1',
    bookTitle: 'Gödel, Escher, Bach: An Eternal Golden Braid',
    quantity: 1,
    status: 'Processing',
    createdAt: '2025-02-23 11:40',
    address: '500 Memorial Drive, Cambridge, MA 02139, USA'
  },
  {
    id: 'ord-171204',
    userId: 'user-sample-4',
    userName: 'Mateo Rossi',
    bookId: 'lit-1',
    bookTitle: 'Invisible Cities',
    quantity: 1,
    status: 'Pending',
    createdAt: '2025-02-24 16:05',
    address: 'Via dei Condotti 10, 00187 Roma, Italy'
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Order[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return seedOrders;
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); } catch { /* ignore */ }
  }, [orders]);

  const placeOrder = useCallback((bookId: string, bookTitle: string, quantity = 1, address = '') => {
    if (!user) return null;
    const order: Order = {
      id: `ord-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      bookId,
      bookTitle,
      quantity,
      status: 'Pending',
      createdAt: new Date().toLocaleString(),
      address: address || 'On file'
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }, [user]);

  const updateStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const userOrders = orders.filter((o) => o.userId === user?.id);
  const allOrders = orders;

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateStatus, deleteOrder, userOrders, allOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};