import { GraduationCap, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"

export function UniversityHeader() {
  return (
    <header className="bg-white border-b-2 border-university-navy shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* University Logo and Name */}
          <div className="flex items-center space-x-4">
            <div className="bg-university-navy p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-university-navy">Cambridge University</h1>
              <p className="text-sm text-slate-600">Student Portal</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-university-navy">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-university-navy">
              <User className="h-4 w-4" />
            </Button>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}
