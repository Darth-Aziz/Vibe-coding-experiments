import { createContext, useContext, useState, ReactNode } from 'react';

export interface Service {
  id: string;
  name: string;
  category: string;
  status: 'Published' | 'Draft';
  requests: number;
  sla: string;
  updated: string;
  description?: string;
  icon?: string;
  visibility?: string;
}

interface ServiceContextType {
  services: Service[];
  addService: (service: Service) => void;
}

const defaultServices: Service[] = [
  { id: '1', name: 'New Laptop Request', category: 'IT', status: 'Published', requests: 18, sla: '4 hours', updated: 'Apr 10, 2026', description: 'Request a new laptop for business use.', icon: 'monitor', visibility: 'internal' },
  { id: '2', name: 'Software Access', category: 'IT', status: 'Published', requests: 12, sla: '2 hours', updated: 'Apr 9, 2026', description: 'Request access to enterprise software applications.', icon: 'box', visibility: 'internal' },
  { id: '3', name: 'VPN Access', category: 'IT', status: 'Published', requests: 8, sla: '1 hour', updated: 'Apr 8, 2026', description: 'Get secure VPN access to the corporate network.', icon: 'server', visibility: 'internal' },
  { id: '4', name: 'Employee Onboarding', category: 'HR', status: 'Published', requests: 3, sla: '24 hours', updated: 'Apr 7, 2026', description: 'Onboard a new employee to the company.', icon: 'briefcase', visibility: 'internal' },
  { id: '5', name: 'Leave Request', category: 'HR', status: 'Published', requests: 15, sla: '4 hours', updated: 'Apr 6, 2026', description: 'Submit a request for annual leave or sick time.', icon: 'briefcase', visibility: 'internal' },
  { id: '6', name: 'Meeting Room Booking', category: 'Facilities', status: 'Draft', requests: 0, sla: '1 hour', updated: 'Apr 5, 2026', description: 'Book a meeting room for your team.', icon: 'box', visibility: 'internal' },
  { id: '7', name: 'Expense Reimbursement', category: 'Finance', status: 'Draft', requests: 0, sla: '48 hours', updated: 'Apr 4, 2026', description: 'Submit out-of-pocket expenses for reimbursement.', icon: 'briefcase', visibility: 'internal' },
];

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(defaultServices);

  const addService = (service: Service) => {
    setServices(prev => [service, ...prev]);
  };

  return (
    <ServiceContext.Provider value={{ services, addService }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
