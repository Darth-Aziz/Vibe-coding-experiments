"use client";

import { useTasheelStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { Eye, Inbox, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "submitted", label: "Submitted" },
  { value: "in_review", label: "In Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function MyRequestsPage() {
  const requests = useTasheelStore((s) => s.requests);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = requests.filter((r) => {
    const byStatus = statusFilter === "all" || r.status === statusFilter;
    const q = search.trim().toLowerCase();
    const bySearch =
      !q ||
      r.ticketNumber.toLowerCase().includes(q) ||
      r.serviceName.toLowerCase().includes(q);
    return byStatus && bySearch;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My requests"
        description="Track tickets you have submitted and filter by status."
        actions={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket or service…"
                className="h-9 bg-background pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v ?? "all")}
            >
              <SelectTrigger className="h-9 w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>
            {statusFilter === "all" ? "All Requests" : `${statuses.find(s => s.value === statusFilter)?.label} Requests`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <EmptyState
              className="border-0 bg-muted/20 py-12"
              icon={Inbox}
              title="No requests match"
              description={
                requests.length === 0
                  ? "Submit a request from the catalog to see it listed here."
                  : "Try another status or clear your search."
              }
              action={
                <Link
                  href="/requester"
                  className={cn(buttonVariants({ variant: "default", size: "sm" }))}
                >
                  Browse catalog
                </Link>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ticket #</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Service</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Submitted</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Updated</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((req) => (
                  <TableRow key={req.id} className="cursor-pointer hover:bg-muted/40">
                    <TableCell className="font-mono text-sm font-medium">
                      {req.ticketNumber}
                    </TableCell>
                    <TableCell>{req.serviceName}</TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(req.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(req.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/requester/requests/${req.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
