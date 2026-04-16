"use client";

import { useState, useEffect } from "react";
import { useTasheelStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/shared/search-bar";
import Link from "next/link";
import { formatDate, getCategoryColor } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { MoreHorizontal, Eye, ArrowRight, Ban, Inbox } from "lucide-react";
import { toast } from "sonner";

function slaInfo(createdAt: string, resolutionHours: number, now: number) {
  const elapsed = (now - new Date(createdAt).getTime()) / 3600000;
  const remaining = resolutionHours - elapsed;
  if (remaining <= 0) return { text: `Breached`, color: "font-semibold text-destructive", breached: true };
  const h = Math.floor(remaining);
  const m = Math.round((remaining - h) * 60);
  if (remaining < resolutionHours * 0.3) return { text: `${h}h ${m}m`, color: "text-warning", breached: false };
  return { text: `${h}h ${m}m`, color: "text-success", breached: false };
}

export default function AdminRequestsPage() {
  const requests = useTasheelStore((s) => s.requests);
  const services = useTasheelStore((s) => s.services);
  const advanceRequest = useTasheelStore((s) => s.advanceRequest);
  const rejectRequest = useTasheelStore((s) => s.rejectRequest);
  const workflows = useTasheelStore((s) => s.workflows);

  const ssrNow = new Date("2026-04-15T12:00:00Z").getTime();
  const [now, setNow] = useState(ssrNow);
  useEffect(() => {
    const id = requestAnimationFrame(() => setNow(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);

  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = requests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (serviceFilter !== "all" && r.serviceId !== serviceFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.ticketNumber.toLowerCase().includes(q) && !r.serviceName.toLowerCase().includes(q) && !r.requesterName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function getStageName(req: typeof requests[0]) {
    const svc = services.find((s) => s.id === req.serviceId);
    const wf = workflows.find((w) => w.id === svc?.workflowId);
    return wf?.stages.find((s) => s.id === req.currentStage)?.name ?? "—";
  }

  const uniqueServices = [...new Set(requests.map((r) => r.serviceId))].map((id) => ({
    id,
    name: services.find((s) => s.id === id)?.name ?? id,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor and manage all service requests</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={serviceFilter} onValueChange={(v) => setServiceFilter(v ?? "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Services" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {uniqueServices.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1 min-w-[200px]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search ticket, service, requester..." />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {sorted.length} of {requests.length} requests
      </p>

      <Card>
        <CardContent className="p-0">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Inbox className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">No requests found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-32 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ticket #</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requester</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current Stage</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">SLA</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Submitted</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((req) => {
                  const svc = services.find((s) => s.id === req.serviceId);
                  const isOpen = !["completed", "cancelled", "rejected"].includes(req.status);
                  const sla = svc && isOpen ? slaInfo(req.createdAt, svc.sla.resolutionTime, now) : null;
                  const canAdvance = ["submitted", "in_review"].includes(req.status);

                  return (
                    <TableRow key={req.id} className="group hover:bg-muted/40">
                      <TableCell>
                        <Link href={`/admin/requests/${req.id}`} className="font-mono text-xs transition-colors hover:text-primary">
                          {req.ticketNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{req.serviceName}</span>
                          {svc && (
                            <Badge variant="secondary" className={`${getCategoryColor(svc.category)} text-[9px]`}>
                              {svc.category.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{req.requesterName}</TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{getStageName(req)}</TableCell>
                      <TableCell>
                        {sla ? (
                          <span className={`text-xs ${sla.color}`}>{sla.text}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(req.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem render={<Link href={`/admin/requests/${req.id}`} />}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            {canAdvance && (
                              <>
                                <DropdownMenuItem onClick={() => {
                                  advanceRequest(req.id, "Approved", "Sarah Mitchell", "Approved by admin");
                                  toast.success(`Request advanced`);
                                }}>
                                  <ArrowRight className="mr-2 h-4 w-4" /> Advance
                                </DropdownMenuItem>
                                <DropdownMenuItem variant="destructive" onClick={() => {
                                  rejectRequest(req.id, "Rejected by admin");
                                  toast.info("Request rejected");
                                }}>
                                  <Ban className="mr-2 h-4 w-4" /> Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem render={<Link href={`/admin/services/${req.serviceId}`} />}>
                              View Service
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
