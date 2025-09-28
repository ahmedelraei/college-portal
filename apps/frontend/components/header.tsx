import { Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground border-b-4 border-accent">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Shield className="h-12 w-12 text-accent" />
              <div>
                <h1 className="text-2xl font-serif font-bold text-balance">
                  Modern Academy
                </h1>
                <p className="text-sm text-primary-foreground/80">
                  Student Portal System
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">Welcome, Ahmed Hatem</p>
              <p className="text-xs text-primary-foreground/80">
                Student ID: 12200207
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary-foreground text-primary hover:bg-accent hover:text-accent-foreground"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
