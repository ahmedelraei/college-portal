import { BookOpen, CreditCard, FileText, Home, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const navItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: BookOpen, label: "Course Catalog", active: false },
    { icon: FileText, label: "Registration", active: false },
    { icon: CreditCard, label: "Payments", active: false },
    { icon: FileText, label: "Academic Records", active: false },
    { icon: Settings, label: "Settings", active: false },
  ]

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                className={`flex items-center gap-2 px-4 py-2 ${
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
