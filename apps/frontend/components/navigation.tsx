"use client";

import { BookOpen, CreditCard, FileText, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Course Catalog", href: "/courses" },
    { icon: FileText, label: "Registration", href: "/courses" },
    { icon: CreditCard, label: "Payments", href: "#" },
    { icon: FileText, label: "Academic Records", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.label}
                variant={isActive ? "default" : "ghost"}
                className={`flex items-center gap-2 px-4 py-2 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => item.href !== "#" && router.push(item.href)}
                disabled={item.href === "#"}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
