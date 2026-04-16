import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";

export function ColorGuide() {
  return (
    <div className="container mx-auto p-12 max-w-6xl space-y-16 pb-32">
      <div className="space-y-4">
        <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Design System Foundations</h2>
        <p className="text-xl text-muted-foreground max-w-3xl">
          The comprehensive guide to colors, typography, spacing, and structural variables for the Tasheel platform, 
          strictly adhering to the enterprise service management design spec.
        </p>
      </div>

      {/* Colors Section */}
      <section className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Core Color Palette</h3>
          <p className="text-muted-foreground mt-2">Brand, structural, and interface colors.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ColorSwatch name="Primary" varName="bg-primary" textClass="text-primary-foreground" hex="var(--primary)" />
          <ColorSwatch name="Secondary" varName="bg-secondary" textClass="text-secondary-foreground" hex="var(--secondary)" />
          <ColorSwatch name="Background" varName="bg-background border" textClass="text-foreground" hex="var(--background)" />
          <ColorSwatch name="Muted" varName="bg-muted" textClass="text-muted-foreground" hex="var(--muted)" />
          <ColorSwatch name="Accent" varName="bg-accent" textClass="text-accent-foreground" hex="var(--accent)" />
          <ColorSwatch name="Card" varName="bg-card border" textClass="text-card-foreground" hex="var(--card)" />
          <ColorSwatch name="Admin Sidebar" varName="bg-admin-sidebar-bg" textClass="text-admin-sidebar-text" hex="var(--admin-sidebar-bg)" />
          <ColorSwatch name="Admin Sidebar Hover" varName="bg-admin-sidebar-hover" textClass="text-admin-sidebar-text" hex="var(--admin-sidebar-hover)" />
          <ColorSwatch name="Requester Nav" varName="bg-requester-nav-bg" textClass="text-requester-nav-text border" hex="var(--requester-nav-bg)" />
          <ColorSwatch name="Border" varName="bg-border" textClass="text-foreground" hex="var(--border)" />
          <ColorSwatch name="Input Background" varName="bg-input-background border" textClass="text-foreground" hex="var(--input-background)" />
          <ColorSwatch name="Ring / Focus" varName="bg-ring" textClass="text-primary-foreground" hex="var(--ring)" />
        </div>
      </section>

      <section className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Status & Semantic Colors</h3>
          <p className="text-muted-foreground mt-2">Semantic colors for badges, alerts, and feedback states.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatusSwatch name="Success" hex="var(--success)" bgClass="bg-success" fgClass="text-success-foreground" />
          <StatusSwatch name="Warning" hex="var(--warning)" bgClass="bg-warning" fgClass="text-warning-foreground" />
          <StatusSwatch name="Danger / Destructive" hex="var(--danger)" bgClass="bg-danger" fgClass="text-danger-foreground" />
          <StatusSwatch name="Info" hex="var(--info)" bgClass="bg-info" fgClass="text-info-foreground" />
        </div>
      </section>

      {/* Typography Section */}
      <section className="space-y-8 border-t pt-12">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Typography</h3>
          <p className="text-muted-foreground mt-2">Font families and text scales used across the interface.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-2xl flex items-center gap-2">
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-mono">var(--font-sans)</span>
                Inter
              </CardTitle>
              <CardDescription>Primary typeface for all portal interfaces. Clean, legible sans-serif.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2 pb-4 border-b">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">h1. Display Heading</h1>
                <p className="text-sm text-muted-foreground font-mono">text-4xl lg:text-5xl / font-extrabold</p>
              </div>
              <div className="space-y-2 pb-4 border-b">
                <h2 className="text-3xl font-semibold tracking-tight transition-colors">h2. Section Title</h2>
                <p className="text-sm text-muted-foreground font-mono">text-3xl / font-semibold</p>
              </div>
              <div className="space-y-2 pb-4 border-b">
                <h3 className="text-2xl font-semibold tracking-tight">h3. Subsection Heading</h3>
                <p className="text-sm text-muted-foreground font-mono">text-2xl / font-semibold</p>
              </div>
              <div className="space-y-2 pb-4 border-b">
                <h4 className="text-xl font-semibold tracking-tight">h4. Component Title</h4>
                <p className="text-sm text-muted-foreground font-mono">text-xl / font-semibold</p>
              </div>
              <div className="space-y-2 pb-4 border-b">
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  p. Paragraph text. Tasheel is a platform designed to simplify enterprise service management. 
                  It brings IT and business teams together on a single unified portal.
                </p>
                <p className="text-sm text-muted-foreground font-mono">leading-7 / text-base</p>
              </div>
              <div className="space-y-2 pb-4 border-b">
                <p className="text-sm font-medium leading-none">Small label or caption</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">text-sm / font-medium</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Extra small helper text and disclaimers.</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">text-xs / text-muted-foreground</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="font-mono text-2xl flex items-center gap-2">
                <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md font-sans">var(--font-mono)</span>
                JetBrains Mono
              </CardTitle>
              <CardDescription>Monospaced font for code snippets, JSON payloads, and identifiers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 font-mono">
              <div className="space-y-1">
                <p className="text-lg font-bold text-primary">REQ-10024</p>
                <p className="text-sm text-muted-foreground font-sans">Ticket/Resource Identifier</p>
              </div>
              <div className="space-y-1">
                <pre className="text-sm bg-muted p-4 rounded-md border text-muted-foreground overflow-x-auto">
{`// Status Configuration Map
const statusConfig = {
  active: { variant: "success" },
  pending: { variant: "warning" },
  archived: { variant: "outline" }
};`}
                </pre>
                <p className="text-sm text-muted-foreground font-sans mt-2">Code Blocks & JSON Previews</p>
              </div>
              <div className="space-y-1 pt-4">
                <p className="text-sm">
                  <span className="bg-muted px-[0.3rem] py-[0.2rem] rounded font-mono text-sm font-semibold">Ctrl + K</span>
                </p>
                <p className="text-sm text-muted-foreground font-sans">Keyboard Shortcuts</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Shapes & Radius */}
      <section className="space-y-8 border-t pt-12">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Shapes & Radii</h3>
          <p className="text-muted-foreground mt-2">Border radius scale for structural components.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center gap-4 p-6 border rounded-sm bg-card">
            <div className="w-16 h-16 bg-primary rounded-sm"></div>
            <div className="text-center">
              <p className="font-medium text-sm">Small</p>
              <p className="text-xs text-muted-foreground font-mono">rounded-sm</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 border rounded-md bg-card">
            <div className="w-16 h-16 bg-primary rounded-md"></div>
            <div className="text-center">
              <p className="font-medium text-sm">Default</p>
              <p className="text-xs text-muted-foreground font-mono">rounded-md</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-card">
            <div className="w-16 h-16 bg-primary rounded-lg"></div>
            <div className="text-center">
              <p className="font-medium text-sm">Large</p>
              <p className="text-xs text-muted-foreground font-mono">rounded-lg</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 p-6 border rounded-full bg-card">
            <div className="w-16 h-16 bg-primary rounded-full"></div>
            <div className="text-center">
              <p className="font-medium text-sm">Full</p>
              <p className="text-xs text-muted-foreground font-mono">rounded-full</p>
            </div>
          </div>
        </div>
      </section>

      {/* Elevation & Shadows */}
      <section className="space-y-8 border-t pt-12">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Elevations & Shadows</h3>
          <p className="text-muted-foreground mt-2">Box shadows representing z-index elevation depths.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-12 bg-secondary/30 rounded-lg border">
          <div className="bg-card h-32 rounded-lg border flex flex-col items-center justify-center shadow-sm">
            <p className="font-medium">Small</p>
            <p className="text-xs text-muted-foreground font-mono mt-1">shadow-sm</p>
            <p className="text-xs text-muted-foreground mt-1">Cards, Inputs</p>
          </div>
          <div className="bg-card h-32 rounded-lg border flex flex-col items-center justify-center shadow">
            <p className="font-medium">Default</p>
            <p className="text-xs text-muted-foreground font-mono mt-1">shadow</p>
            <p className="text-xs text-muted-foreground mt-1">Dropdowns, Popovers</p>
          </div>
          <div className="bg-card h-32 rounded-lg border flex flex-col items-center justify-center shadow-lg">
            <p className="font-medium">Large</p>
            <p className="text-xs text-muted-foreground font-mono mt-1">shadow-lg</p>
            <p className="text-xs text-muted-foreground mt-1">Dialogs, Modals</p>
          </div>
        </div>
      </section>

    </div>
  );
}

function ColorSwatch({ name, varName, textClass, hex }: { name: string, varName: string, textClass: string, hex: string }) {
  return (
    <div className="flex flex-col space-y-2 group">
      <div className={`h-32 w-full rounded-lg ${varName} flex items-end p-4 shadow-sm transition-transform group-hover:-translate-y-1 group-hover:shadow-md border`}>
        <span className={`font-mono text-sm font-medium ${textClass}`}>{hex}</span>
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-sm">{name}</h4>
        <p className="text-xs text-muted-foreground font-mono">{varName.split(' ')[0]}</p>
      </div>
    </div>
  )
}

function StatusSwatch({ name, hex, bgClass, fgClass }: { name: string, hex: string, bgClass: string, fgClass: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${bgClass}`}></div>
          <span className="font-medium text-sm">{name}</span>
        </div>
      </div>
      <div className={`h-16 rounded-md ${bgClass} ${fgClass} flex flex-col justify-center px-4 font-mono text-sm border-transparent shadow-sm`}>
        <span className="opacity-90">{hex}</span>
        <span className="text-xs opacity-70 mt-1">{bgClass}</span>
      </div>
    </div>
  )
}
