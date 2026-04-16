import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ServiceProvider } from './context/ServiceContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <ServiceProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </ServiceProvider>
  );
}