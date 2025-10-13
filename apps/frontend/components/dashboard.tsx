"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CreditCard,
  GraduationCap,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
  User,
  LogOut,
  Settings,
  Bell,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { GET_MY_CURRENT_SEMESTER_REGISTRATIONS_QUERY } from "@/lib/graphql/registrations";

export function Dashboard() {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Current semester/year (should match the courses page)
  const currentSemester = "winter";
  const currentYear = 2025;

  // Fetch current semester registrations
  const {
    data: registrationsData,
    loading: registrationsLoading,
    error: registrationsError,
  } = useQuery(GET_MY_CURRENT_SEMESTER_REGISTRATIONS_QUERY, {
    variables: {
      semester: currentSemester,
      year: currentYear,
    },
    skip: !isAuthenticated || authLoading || user?.role === "admin",
  });

  // Redirect if not authenticated or if admin user
  useEffect(() => {
    console.log(
      "[Dashboard Component] Auth check - authLoading:",
      authLoading,
      "isAuthenticated:",
      isAuthenticated,
      "role:",
      user?.role
    );

    if (!authLoading) {
      if (!isAuthenticated) {
        console.log(
          "[Dashboard Component] Not authenticated, redirecting to /login"
        );
        router.push("/login");
      } else if (user?.role === "admin") {
        console.log(
          "[Dashboard Component] Admin detected, redirecting to /admin/panel"
        );
        router.push("/admin/panel");
      } else {
        console.log(
          "[Dashboard Component] Student authenticated, showing dashboard"
        );
        setIsLoading(false);
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Calculate stats from real data
  const registrations =
    registrationsData?.getMyCurrentSemesterRegistrations || [];
  const activeRegistrations = registrations.filter(
    (reg: any) => !reg.isDropped
  );
  const enrolledCoursesCount = activeRegistrations.length;
  const totalCreditHours = activeRegistrations.reduce(
    (sum: number, reg: any) => sum + reg.course.creditHours,
    0
  );

  if (isLoading || registrationsLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section with User Info */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
              Welcome back, {user.firstName}!
            </h2>
            <p className="text-muted-foreground text-lg">
              Student ID: {user.studentId} •{" "}
              {currentSemester.charAt(0).toUpperCase() +
                currentSemester.slice(1)}{" "}
              Semester {currentYear}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Registration Period: October 1 - 7, 2024
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current GPA
            </CardTitle>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {user?.currentGPA?.toFixed(2) || "0.00"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.currentGPA
                ? user.currentGPA >= 3.5
                  ? "Excellent performance"
                  : user.currentGPA >= 3.0
                    ? "Good standing"
                    : user.currentGPA >= 2.0
                      ? "Satisfactory"
                      : "Needs improvement"
                : "No grades yet"}
            </p>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-secondary hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled Courses
            </CardTitle>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-secondary" />
              <span className="text-2xl font-bold text-foreground">
                {enrolledCoursesCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {currentSemester.charAt(0).toUpperCase() +
                currentSemester.slice(1)}{" "}
              {currentYear}
            </p>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-accent hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Credit Hours
            </CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              <span className="text-2xl font-bold text-foreground">
                {totalCreditHours}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Current semester</p>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Account Balance
            </CardTitle>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-foreground">$0.00</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All payments current
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Registrations */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <BookOpen className="h-5 w-5 text-primary" />
              Current Registrations
            </CardTitle>
            <CardDescription>
              {currentSemester.charAt(0).toUpperCase() +
                currentSemester.slice(1)}{" "}
              Semester {currentYear}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {registrationsError && (
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-8 w-8 mx-auto text-destructive mb-2" />
                <p className="text-sm text-destructive">
                  Error loading registrations
                </p>
              </div>
            )}

            {!registrationsError && activeRegistrations.length === 0 && (
              <div className="text-center p-8">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-1">
                  No courses registered yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Start by browsing available courses
                </p>
              </div>
            )}

            {!registrationsError &&
              activeRegistrations.map((registration: any) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">
                        {registration.course.courseCode}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {registration.course.creditHours} Credits
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {registration.course.courseName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {registration.course.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      {registration.paymentStatus === "paid" ? (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Paid
                        </p>
                      ) : (
                        <p className="text-xs text-yellow-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Payment Pending
                        </p>
                      )}
                    </div>
                    {registration.grade ? (
                      <Badge variant="default" className="text-xs">
                        Grade: {registration.grade}
                      </Badge>
                    ) : registration.isCompleted ? (
                      <Badge variant="secondary" className="text-xs">
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            <div className="pt-2 border-t border-border">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/courses")}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Browse & Register for Courses
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Academic Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <GraduationCap className="h-5 w-5 text-primary" />
              Academic Progress
            </CardTitle>
            <CardDescription>Degree Requirements Status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Core Requirements</span>
                <Badge variant="default">24/30 Credits</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Electives</span>
                <Badge variant="secondary">18/24 Credits</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Capstone Project</span>
                <Badge variant="outline">Not Started</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-muted-foreground h-2 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Total Progress</span>
                <span className="font-bold">42/54 Credits (78%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <AlertCircle className="h-5 w-5 text-accent" />
              Important Notices
            </CardTitle>
            <CardDescription>
              Academic announcements and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-md">
              <p className="text-sm font-medium text-foreground">
                Registration Reminder
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Summer semester registration opens December 15th. Plan your
                courses early.
              </p>
            </div>
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-md">
              <p className="text-sm font-medium text-foreground">
                Academic Calendar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Winter break: December 20 - January 8. Classes resume January
                9th.
              </p>
            </div>
            <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-md">
              <p className="text-sm font-medium text-foreground">
                Graduation Application
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Applications for May graduation are due February 1st, 2024.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Calendar className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start hover:bg-primary/5 transition-colors"
              variant="outline"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Course Catalog
            </Button>
            <Button
              className="w-full justify-start hover:bg-primary/5 transition-colors"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Transcript
            </Button>
            <Button
              className="w-full justify-start hover:bg-primary/5 transition-colors"
              variant="outline"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Make Payment
            </Button>
            <Button
              className="w-full justify-start hover:bg-primary/5 transition-colors"
              variant="outline"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Academic Advising
            </Button>
            <Button
              className="w-full justify-start hover:bg-primary/5 transition-colors"
              variant="outline"
            >
              <Clock className="h-4 w-4 mr-2" />
              Class Schedule
            </Button>
            <Button
              className="w-full justify-start hover:bg-primary/5 transition-colors"
              variant="outline"
            >
              <User className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest academic updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Registration Confirmed
                </p>
                <p className="text-xs text-muted-foreground">
                  Successfully enrolled in CS301 - Advanced Algorithms
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Grade Posted
                </p>
                <p className="text-xs text-muted-foreground">
                  MATH205 - Linear Algebra: A-
                </p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Payment Reminder
                </p>
                <p className="text-xs text-muted-foreground">
                  Winter semester payment due in 5 days
                </p>
                <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton component for loading state
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome Section Skeleton */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-56" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-24 mb-2" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-3 w-20 mt-1" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
