"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, GraduationCap, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  studentId: z.coerce.number().min(1, "Student ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      // Small delay to show success state
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      // Error handling is done in the context
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* University Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Modern Academy
          </h1>
          <p className="text-muted-foreground font-medium">
            Student Portal System
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-serif text-foreground">
              Student Login
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your college credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="studentId"
                  className="text-sm font-medium text-foreground"
                >
                  Student ID
                </Label>
                <Input
                  id="studentId"
                  type="number"
                  placeholder="e.g., 12200207"
                  className="h-11 border-border focus:border-primary focus:ring-primary"
                  {...register("studentId")}
                  disabled={isLoading}
                />
                {errors.studentId && (
                  <p className="text-sm text-destructive">
                    {errors.studentId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-11 border-border focus:border-primary focus:ring-primary"
                  {...register("password")}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-3">
              <a
                href="#"
                className="text-sm text-secondary hover:text-secondary/80 font-medium"
              >
                Forgot your password?
              </a>

              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Need an account? Contact your academic advisor for
                  registration assistance.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Administrator?{" "}
                  <a
                    href="/admin/login"
                    className="text-secondary hover:text-secondary/80 font-medium"
                  >
                    Admin Login
                  </a>
                </p>
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  Need help? Contact IT Support at{" "}
                  <a
                    href="mailto:support@modernacademy.edu"
                    className="text-secondary hover:underline"
                  >
                    support@modernacademy.edu
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-muted-foreground">
          <p>© 2024 Modern Academy. All rights reserved.</p>
          <p className="mt-1">
            By logging in, you agree to our{" "}
            <a href="#" className="text-secondary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-secondary hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
