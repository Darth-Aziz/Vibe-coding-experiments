import React from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { RequesterLayout } from "../components/layouts/RequesterLayout";
import { StatusBadge } from "../components/StatusBadge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Slider } from "../components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export function ComponentGuide() {
  return (
    <div className="container mx-auto p-12 max-w-6xl space-y-16 pb-32">
      <div className="space-y-4">
        <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Component Library</h2>
        <p className="text-xl text-muted-foreground max-w-3xl">
          A comprehensive showcase of reusable UI components for building the Tasheel platform screens, 
          featuring customized interactive elements.
        </p>
      </div>

      {/* Buttons */}
      <section className="space-y-8 pt-8 border-t">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Buttons & Actions</h3>
          <p className="text-muted-foreground mt-2">Interactive elements for user actions and form submissions.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 p-8 border rounded-lg bg-card text-card-foreground shadow-sm">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Status Badges */}
      <section className="space-y-8 pt-8 border-t">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Status Badges</h3>
          <p className="text-muted-foreground mt-2">Standardized Badges with indicator dots (using StatusBadge).</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 p-8 border rounded-lg bg-card text-card-foreground shadow-sm">
          <StatusBadge status="Draft" />
          <StatusBadge status="Pending" />
          <StatusBadge status="In Review" />
          <StatusBadge status="Submitted" />
          <StatusBadge status="Approved" />
          <StatusBadge status="Published" />
          <StatusBadge status="Active" />
          <StatusBadge status="Rejected" />
          <StatusBadge status="Failed" />
          <StatusBadge status="Archived" />
        </div>
      </section>

      {/* Forms & Inputs */}
      <section className="space-y-8 pt-8 border-t">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Form Controls</h3>
          <p className="text-muted-foreground mt-2">Inputs for data collection and workflows.</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 p-8 border rounded-lg bg-card shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="service-name">Standard Input</Label>
            <Input id="service-name" placeholder="e.g. Request new laptop" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Read-Only / Disabled</Label>
            <Input id="category" defaultValue="IT Hardware" disabled />
          </div>
          <div className="space-y-2">
            <Label>Select Dropdown</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="it">Information Technology</SelectItem>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <Label>Checkboxes</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm font-medium leading-none">Accept terms and conditions</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="marketing" disabled />
                <label htmlFor="marketing" className="text-sm font-medium leading-none opacity-70">Subscribe to newsletter (disabled)</label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Radio Group</Label>
            <RadioGroup defaultValue="standard">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="r1" />
                <Label htmlFor="r1">Standard SLA (3 days)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expedited" id="r2" />
                <Label htmlFor="r2">Expedited SLA (24 hrs)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Toggles & Sliders</Label>
            <div className="flex items-center justify-between mt-2">
              <Label htmlFor="airplane-mode" className="font-normal">Require Approval</Label>
              <Switch id="airplane-mode" />
            </div>
            <div className="pt-4 space-y-3">
              <Label>Priority Weight</Label>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
          </div>
        </div>
      </section>

      {/* Feedback & Alerts */}
      <section className="space-y-8 pt-8 border-t">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Feedback & Alerts</h3>
          <p className="text-muted-foreground mt-2">In-context alerts and user feedback mechanisms.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Informational Note</AlertTitle>
            <AlertDescription>
              Your request has been saved as a draft. You can continue editing it later.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Action Required</AlertTitle>
            <AlertDescription>
              The workflow configuration is invalid. Please check the assigned approvers.
            </AlertDescription>
          </Alert>
          <Alert className="border-success/50 text-success dark:border-success [&>svg]:text-success bg-success/5">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Service catalog published successfully.
            </AlertDescription>
          </Alert>
          <Alert className="border-warning/50 text-warning dark:border-warning [&>svg]:text-warning bg-warning/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              This service has no active approvers assigned. Auto-approval will be used.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Data Display */}
      <section className="space-y-8 pt-8 border-t">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Data Display</h3>
          <p className="text-muted-foreground mt-2">Tables, Avatars, and Data Views.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium font-mono text-xs">REQ-10023</TableCell>
                  <TableCell>Software License Request</TableCell>
                  <TableCell><StatusBadge status="Approved" /></TableCell>
                  <TableCell className="text-right text-muted-foreground">Oct 12, 2023</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium font-mono text-xs">REQ-10024</TableCell>
                  <TableCell>Hardware Refresh (Laptop)</TableCell>
                  <TableCell><StatusBadge status="Pending" /></TableCell>
                  <TableCell className="text-right text-muted-foreground">Oct 14, 2023</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium font-mono text-xs">REQ-10025</TableCell>
                  <TableCell>VPN Access</TableCell>
                  <TableCell><StatusBadge status="Rejected" /></TableCell>
                  <TableCell className="text-right text-muted-foreground">Oct 15, 2023</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-sm">User Avatars</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback className="bg-warning/10 text-warning">SA</AvatarFallback>
                </Avatar>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Navigation & Layouts */}
      <section className="space-y-8 pt-8 border-t">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Navigation & Structure</h3>
          <p className="text-muted-foreground mt-2">Tabs, Accordions, and structural components.</p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tabs Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Service Details</TabsTrigger>
                  <TabsTrigger value="workflow">Workflow</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground bg-muted/20">
                  Detailed information about the service request, SLA configurations, and category mappings.
                </TabsContent>
                <TabsContent value="workflow" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground bg-muted/20">
                  Visual representation of the approval steps and conditional routing for this service.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accordion Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is Tasheel?</AccordionTrigger>
                  <AccordionContent>
                    Tasheel is a comprehensive enterprise service management platform connecting IT, HR, and Facilities.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How are workflows triggered?</AccordionTrigger>
                  <AccordionContent>
                    Workflows are automatically triggered upon service request submission based on the predefined blueprint.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Full Layout Previews */}
      <section className="space-y-8 pt-8 border-t">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Layout Previews</h3>
          <p className="text-muted-foreground mt-2">Primary page structures for Admin and Requester personas.</p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Admin Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Layout</CardTitle>
              <CardDescription>Dark sidebar for platform management.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden shadow-sm aspect-video relative pointer-events-none select-none">
                <div className="absolute inset-0 scale-[0.5] origin-top-left w-[200%] h-[200%]">
                  <AdminLayout>
                    <div className="p-8 space-y-6">
                      <div className="h-10 w-1/3 bg-muted rounded"></div>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="h-32 bg-card border rounded-md shadow-sm"></div>
                        <div className="h-32 bg-card border rounded-md shadow-sm"></div>
                        <div className="h-32 bg-card border rounded-md shadow-sm"></div>
                      </div>
                    </div>
                  </AdminLayout>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requester Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Requester Layout</CardTitle>
              <CardDescription>Light top-nav for service browsing.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden shadow-sm aspect-video bg-background relative pointer-events-none select-none">
                <div className="absolute inset-0 scale-[0.5] origin-top-left w-[200%] h-[200%]">
                  <RequesterLayout>
                    <div className="p-8 space-y-6 max-w-5xl mx-auto">
                      <div className="h-12 w-1/4 bg-primary/10 rounded"></div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="h-48 bg-card border rounded-md shadow-sm"></div>
                        <div className="h-48 bg-card border rounded-md shadow-sm"></div>
                      </div>
                    </div>
                  </RequesterLayout>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
}