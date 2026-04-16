import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search, MoreHorizontal, FileText, Settings, ArrowUpDown } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

const services = [
  { id: '1', name: 'New Laptop Request', category: 'IT', status: 'Published', requests: 18, sla: '4 hours', updated: 'Apr 10, 2026' },
  { id: '2', name: 'Software Access', category: 'IT', status: 'Published', requests: 12, sla: '2 hours', updated: 'Apr 9, 2026' },
  { id: '3', name: 'VPN Access', category: 'IT', status: 'Published', requests: 8, sla: '1 hour', updated: 'Apr 8, 2026' },
  { id: '4', name: 'Employee Onboarding', category: 'HR', status: 'Published', requests: 3, sla: '24 hours', updated: 'Apr 7, 2026' },
  { id: '5', name: 'Leave Request', category: 'HR', status: 'Published', requests: 15, sla: '4 hours', updated: 'Apr 6, 2026' },
  { id: '6', name: 'Meeting Room Booking', category: 'Facilities', status: 'Draft', requests: 0, sla: '1 hour', updated: 'Apr 5, 2026' },
  { id: '7', name: 'Expense Reimbursement', category: 'Finance', status: 'Draft', requests: 0, sla: '48 hours', updated: 'Apr 4, 2026' },
];

const categories = ['All', 'IT', 'HR', 'Facilities', 'Finance'];

export function AdminServices() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = services.filter((s) => {
    if (filter !== 'All' && s.category !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Service Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage and configure your available services</p>
        </div>
        <Button onClick={() => navigate('/admin/services/new')} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Service
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="pl-9 h-10 bg-background"
          />
        </div>
        <div className="flex bg-muted/50 p-1 rounded-lg border border-border">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === c
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px] font-medium text-muted-foreground uppercase text-xs tracking-wider">Service Name</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Category</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Status</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase text-xs tracking-wider text-right">Requests</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase text-xs tracking-wider">SLA</TableHead>
                <TableHead className="font-medium text-muted-foreground uppercase text-xs tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                    Last Modified
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow 
                  key={s.id} 
                  className="cursor-pointer group hover:bg-muted/30"
                  onClick={() => navigate(`/admin/services/${s.id}/form`)}
                >
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.category}</TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{s.requests}</TableCell>
                  <TableCell className="text-muted-foreground">{s.sla}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{s.updated}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onClick={() => navigate(`/admin/services/${s.id}/form`)}>
                          <Settings className="w-4 h-4 mr-2" /> Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" /> Duplicate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No services found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
