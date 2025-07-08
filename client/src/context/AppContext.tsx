import React, { createContext, useState, type ReactNode, useCallback } from 'react';


export interface Party {
  id: string;
  name: string;
  phone: string;
  category: 'Customer' | 'Supplier';
}

export interface Item {
  id: string;
  name:string;
  stock: number;
  price: number;
}

export interface InvoiceItem {
  itemId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: string;
  partyId: string;
  items: InvoiceItem[];
  total: number;
  date: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  parties: Party[];
  addParty: (party: Omit<Party, 'id'>) => void;
  items: Item[];
  addItem: (item: Omit<Item, 'id'>) => void;
  updateItemStock: (itemId: string, quantityChange: number) => void;
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const initialParties: Party[] = [
    { id: '1', name: 'Retail Hub', phone: '9876543210', category: 'Customer' },
    { id: '2', name: 'Wholesale Supplies', phone: '8765432109', category: 'Supplier' },
    { id: '3', name: 'Local Grocers', phone: '7654321098', category: 'Customer' },
];

const initialItems: Item[] = [
    { id: '101', name: 'Organic Apples', stock: 50, price: 150 },
    { id: '102', name: 'Brown Bread', stock: 30, price: 45 },
    { id: '103', name: 'Almond Milk', stock: 20, price: 220 },
    { id: '104', name: 'Quinoa', stock: 8, price: 300 },
    { id: '105', name: 'Greek Yogurt', stock: 15, price: 90 },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [parties, setParties] = useState<Party[]>(initialParties);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const login = useCallback(() => setIsAuthenticated(true), []);
  const logout = useCallback(() => setIsAuthenticated(false), []);

  const addParty = useCallback((party: Omit<Party, 'id'>) => {
    const newParty = { ...party, id: new Date().toISOString() };
    setParties(prev => [...prev, newParty]);
  }, []);

  const addItem = useCallback((item: Omit<Item, 'id'>) => {
    const newItem = { ...item, id: new Date().toISOString() };
    setItems(prev => [...prev, newItem]);
  }, []);

  const updateItemStock = useCallback((itemId: string, quantityChange: number) => {
    setItems(prevItems => prevItems.map(item =>
      item.id === itemId ? { ...item, stock: item.stock + quantityChange } : item
    ));
  }, []);

  const addInvoice = useCallback((invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = { ...invoice, id: new Date().toISOString() };
    setInvoices(prev => [...prev, newInvoice]);
    invoice.items.forEach((invoiceItem: { itemId: string; qty: number; }) => {
        updateItemStock(invoiceItem.itemId, -invoiceItem.qty);
    });
  }, [updateItemStock]);

  const value = { isAuthenticated, login, logout, parties, addParty, items, addItem, updateItemStock, invoices, addInvoice };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};