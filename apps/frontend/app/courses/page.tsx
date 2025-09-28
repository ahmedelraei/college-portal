import { AuthGuard } from "@/components/auth-guard"
import { UniversityHeader } from "@/components/university-header"
import { CourseCatalog } from "@/components/course-catalog"

export default function CoursesPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <UniversityHeader />
        <CourseCatalog />
      </div>
    </AuthGuard>
  )
}
