"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  Users,
  UserPlus,
  LogOut,
  GraduationCap,
  Mail,
  Calendar,
  Shield,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Award,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AddStudentForm } from "@/components/admin/add-student-form";
import { CourseForm } from "@/components/admin/course-form";
import { GradesManager } from "@/components/admin/grades-manager";
import { GET_ALL_STUDENTS_QUERY, type User } from "@/lib/graphql/auth";
import {
  GET_ALL_COURSES_QUERY,
  DELETE_COURSE_MUTATION,
  type Course,
} from "@/lib/graphql/courses";
import {
  IS_REGISTRATION_ENABLED_QUERY,
  TOGGLE_REGISTRATION_MUTATION,
} from "@/lib/graphql/system-settings";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminPanelPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "courses" | "grades">(
    "students"
  );

  // Redirect if not authenticated or not admin
  useEffect(() => {
    console.log(
      "[AdminPanel] Auth check - isLoading:",
      isLoading,
      "isAuthenticated:",
      isAuthenticated,
      "role:",
      user?.role
    );

    if (!isLoading) {
      if (!isAuthenticated) {
        console.log(
          "[AdminPanel] Not authenticated, redirecting to /admin/login"
        );
        router.push("/admin/login");
      } else if (user?.role !== "admin") {
        console.log(
          "[AdminPanel] Non-admin user, role:",
          user?.role,
          "- redirecting to /dashboard"
        );
        router.push("/dashboard");
      } else {
        console.log("[AdminPanel] Admin authenticated successfully");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const {
    data: studentsData,
    loading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents,
  } = useQuery(GET_ALL_STUDENTS_QUERY, {
    skip: !isAuthenticated || user?.role !== "admin",
  });

  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useQuery(GET_ALL_COURSES_QUERY, {
    skip: !isAuthenticated || user?.role !== "admin",
  });

  const {
    data: registrationStatusData,
    loading: registrationStatusLoading,
    refetch: refetchRegistrationStatus,
  } = useQuery(IS_REGISTRATION_ENABLED_QUERY, {
    skip: !isAuthenticated || user?.role !== "admin",
  });

  const [deleteCourse] = useMutation(DELETE_COURSE_MUTATION, {
    refetchQueries: [GET_ALL_COURSES_QUERY],
  });

  const [toggleRegistration] = useMutation(TOGGLE_REGISTRATION_MUTATION, {
    refetchQueries: [IS_REGISTRATION_ENABLED_QUERY],
  });

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleStudentAdded = () => {
    setIsAddStudentOpen(false);
    refetchStudents();
    toast.success("Student added successfully!");
  };

  const handleCourseAdded = () => {
    setIsAddCourseOpen(false);
    refetchCourses();
    toast.success("Course added successfully!");
  };

  const handleCourseUpdated = () => {
    setIsEditCourseOpen(false);
    setSelectedCourse(null);
    refetchCourses();
    toast.success("Course updated successfully!");
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditCourseOpen(true);
  };

  const handleDeleteCourse = async (courseId: number, courseName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${courseName}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteCourse({
          variables: { id: courseId },
        });
        toast.success("Course deleted successfully!");
      } catch (error: any) {
        console.error("Delete course error:", error);
        toast.error(error.message || "Failed to delete course");
      }
    }
  };

  const handleToggleRegistration = async (enabled: boolean) => {
    try {
      await toggleRegistration({
        variables: { enabled },
      });
      toast.success(
        enabled
          ? "Course registration enabled for all students!"
          : "Course registration disabled for all students!"
      );
      refetchRegistrationStatus();
    } catch (error: any) {
      console.error("Toggle registration error:", error);
      toast.error(error.message || "Failed to toggle registration");
    }
  };

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="bg-secondary p-3 rounded-full mb-4 mx-auto w-fit">
            <Shield className="h-8 w-8 text-secondary-foreground" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null; // Will redirect via useEffect
  }

  const students = studentsData?.getAllStudents || [];
  const courses = coursesData?.getAllCourses || [];
  const isRegistrationEnabled =
    registrationStatusData?.isRegistrationEnabled ?? true;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary text-secondary-foreground border-b-4 border-accent">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Settings className="h-12 w-12 text-accent" />
                <div>
                  <h1 className="text-2xl font-serif font-bold">
                    Modern Academy
                  </h1>
                  <p className="text-sm text-secondary-foreground/80">
                    Administrative Panel
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  Welcome, {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-secondary-foreground/80">
                  Administrator
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-secondary-foreground text-secondary hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center py-8 bg-card rounded-lg border border-border">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
              Administrative Dashboard
            </h2>
            <p className="text-muted-foreground text-lg">
              Manage students and system settings
            </p>
          </div>

          {/* Registration Toggle Section */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-serif">
                      Course Registration Control
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      Enable or disable student course registration system-wide
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Badge
                      variant={isRegistrationEnabled ? "default" : "secondary"}
                      className={
                        isRegistrationEnabled
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }
                    >
                      {isRegistrationEnabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 bg-card p-4 rounded-lg border">
                    <Label
                      htmlFor="registration-toggle"
                      className="text-sm font-medium cursor-pointer"
                    >
                      {isRegistrationEnabled
                        ? "Disable Registration"
                        : "Enable Registration"}
                    </Label>
                    <Switch
                      id="registration-toggle"
                      checked={isRegistrationEnabled}
                      onCheckedChange={handleToggleRegistration}
                      disabled={registrationStatusLoading}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  {isRegistrationEnabled
                    ? "Students can currently register for courses. Toggle off to prevent new registrations."
                    : "Course registration is disabled. Students cannot register for new courses until you enable it."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Students
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">
                    {students.length}
                  </span>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-secondary">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Courses
                </CardTitle>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-secondary" />
                  <span className="text-2xl font-bold text-foreground">
                    {courses.length}
                  </span>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-accent">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Courses
                </CardTitle>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-accent" />
                  <span className="text-2xl font-bold text-foreground">
                    {courses.filter((course: Course) => course.isActive).length}
                  </span>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  System Status
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <Badge variant="default" className="bg-green-600">
                    Online
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Management Tabs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    {activeTab === "students" ? (
                      <>
                        <Users className="h-5 w-5 text-primary" />
                        Student Management
                      </>
                    ) : activeTab === "courses" ? (
                      <>
                        <BookOpen className="h-5 w-5 text-primary" />
                        Course Management
                      </>
                    ) : (
                      <>
                        <Award className="h-5 w-5 text-primary" />
                        Grades Management
                      </>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === "students"
                      ? "View and manage all registered students"
                      : activeTab === "courses"
                        ? "View and manage all courses"
                        : "Assign and manage student grades"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-muted rounded-lg p-1">
                    <Button
                      variant={activeTab === "students" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("students")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Students
                    </Button>
                    <Button
                      variant={activeTab === "courses" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("courses")}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Courses
                    </Button>
                    <Button
                      variant={activeTab === "grades" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("grades")}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Grades
                    </Button>
                  </div>
                  {activeTab === "students" ? (
                    <Dialog
                      open={isAddStudentOpen}
                      onOpenChange={setIsAddStudentOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Student
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Student</DialogTitle>
                          <DialogDescription>
                            Create a new student account with login credentials.
                          </DialogDescription>
                        </DialogHeader>
                        <AddStudentForm onSuccess={handleStudentAdded} />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Dialog
                      open={isAddCourseOpen}
                      onOpenChange={setIsAddCourseOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Course
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Add New Course</DialogTitle>
                          <DialogDescription>
                            Create a new course with details and prerequisites.
                          </DialogDescription>
                        </DialogHeader>
                        <CourseForm
                          onSuccess={handleCourseAdded}
                          onCancel={() => setIsAddCourseOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === "grades" ? (
                // Grades Tab Content - Removed from Card wrapper
                <div className="-m-6">
                  <GradesManager />
                </div>
              ) : activeTab === "students" ? (
                // Students Tab Content
                studentsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading students...</p>
                  </div>
                ) : studentsError ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">
                      Error loading students: {studentsError.message}
                    </p>
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No students registered yet. Add your first student to get
                      started.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student: User) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.studentId}
                          </TableCell>
                          <TableCell>
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {student.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{student.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {student.createdAt
                                ? new Date(
                                    student.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              ) : // Courses Tab Content
              coursesLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading courses...</p>
                </div>
              ) : coursesError ? (
                <div className="text-center py-8">
                  <p className="text-destructive">
                    Error loading courses: {coursesError.message}
                  </p>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No courses available yet. Add your first course to get
                    started.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Prerequisites</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course: Course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          {course.courseCode}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{course.courseName}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {course.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {course.creditHours} credits
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {course.semester}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {course.prerequisites.length === 0 ? (
                              <span className="text-sm text-muted-foreground">
                                None
                              </span>
                            ) : (
                              course.prerequisites.map((prereq) => (
                                <Badge
                                  key={prereq.id}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {prereq.courseCode}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={course.isActive ? "default" : "secondary"}
                          >
                            {course.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCourse(course)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteCourse(course.id, course.courseName)
                              }
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Edit Course Dialog */}
      <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course details and prerequisites.
            </DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <CourseForm
              course={selectedCourse}
              onSuccess={handleCourseUpdated}
              onCancel={() => {
                setIsEditCourseOpen(false);
                setSelectedCourse(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
