"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@apollo/client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import {
  CREATE_COURSE_MUTATION,
  UPDATE_COURSE_MUTATION,
  GET_ALL_COURSES_QUERY,
  type Course,
  type CreateCourseInput,
  type UpdateCourseInput,
} from "@/lib/graphql/courses";

const courseSchema = z.object({
  courseCode: z
    .string()
    .min(2, "Course code must be at least 2 characters")
    .max(10, "Course code must be less than 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Course code must contain only uppercase letters and numbers"
    ),
  courseName: z
    .string()
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  creditHours: z.coerce
    .number()
    .min(1, "Credit hours must be at least 1")
    .max(6, "Credit hours must be at most 6"),
  semester: z.enum(["summer", "winter"], {
    required_error: "Please select a semester",
  }),
  prerequisiteIds: z.array(z.number()).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: Course;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CourseForm({ course, onSuccess, onCancel }: CourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!course;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseCode: course?.courseCode || "",
      courseName: course?.courseName || "",
      description: course?.description || "",
      creditHours: course?.creditHours || 3,
      semester: course?.semester || "summer",
      prerequisiteIds: course?.prerequisites?.map((p) => p.id) || [],
    },
  });

  const { data: coursesData } = useQuery(GET_ALL_COURSES_QUERY);
  const availableCourses =
    coursesData?.getAllCourses?.filter((c: Course) => c.id !== course?.id) ||
    [];

  const [createCourse] = useMutation(CREATE_COURSE_MUTATION, {
    refetchQueries: [GET_ALL_COURSES_QUERY],
  });

  const [updateCourse] = useMutation(UPDATE_COURSE_MUTATION, {
    refetchQueries: [GET_ALL_COURSES_QUERY],
  });

  const watchedPrerequisites = watch("prerequisiteIds") || [];

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        const updateInput: UpdateCourseInput = {
          courseCode: data.courseCode,
          courseName: data.courseName,
          description: data.description,
          creditHours: data.creditHours,
          prerequisiteIds: data.prerequisiteIds,
        };
        await updateCourse({
          variables: {
            id: course.id,
            updateCourseInput: updateInput,
          },
        });
        toast.success("Course updated successfully!");
      } else {
        const createInput: CreateCourseInput = {
          courseCode: data.courseCode,
          courseName: data.courseName,
          description: data.description,
          creditHours: data.creditHours,
          prerequisiteIds: data.prerequisiteIds,
        };
        await createCourse({
          variables: {
            createCourseInput: createInput,
          },
        });
        toast.success("Course created successfully!");
      }
      onSuccess();
    } catch (error: any) {
      console.error("Course operation error:", error);
      toast.error(error.message || "An error occurred while saving the course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrerequisiteChange = (courseId: number, checked: boolean) => {
    const currentPrerequisites = watchedPrerequisites;
    if (checked) {
      setValue("prerequisiteIds", [...currentPrerequisites, courseId]);
    } else {
      setValue(
        "prerequisiteIds",
        currentPrerequisites.filter((id) => id !== courseId)
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="courseCode" className="text-sm font-medium">
            Course Code *
          </Label>
          <Input
            id="courseCode"
            placeholder="e.g., CS301"
            className="h-10"
            {...register("courseCode")}
            disabled={isSubmitting}
          />
          {errors.courseCode && (
            <p className="text-sm text-destructive">
              {errors.courseCode.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditHours" className="text-sm font-medium">
            Credit Hours *
          </Label>
          <Input
            id="creditHours"
            type="number"
            min="1"
            max="6"
            className="h-10"
            {...register("creditHours")}
            disabled={isSubmitting}
          />
          {errors.creditHours && (
            <p className="text-sm text-destructive">
              {errors.creditHours.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="semester" className="text-sm font-medium">
          Semester *
        </Label>
        <Select
          value={watch("semester")}
          onValueChange={(value) =>
            setValue("semester", value as "summer" | "winter")
          }
          disabled={isSubmitting}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="summer">Summer</SelectItem>
            <SelectItem value="winter">Winter</SelectItem>
          </SelectContent>
        </Select>
        {errors.semester && (
          <p className="text-sm text-destructive">{errors.semester.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseName" className="text-sm font-medium">
          Course Name *
        </Label>
        <Input
          id="courseName"
          placeholder="e.g., Advanced Algorithms"
          className="h-10"
          {...register("courseName")}
          disabled={isSubmitting}
        />
        {errors.courseName && (
          <p className="text-sm text-destructive">
            {errors.courseName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description *
        </Label>
        <Textarea
          id="description"
          placeholder="Enter course description..."
          className="min-h-[100px]"
          {...register("description")}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Prerequisites (Optional)</Label>
        <div className="max-h-40 overflow-y-auto border border-border rounded-md p-3 space-y-2">
          {availableCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No courses available
            </p>
          ) : (
            availableCourses.map((availableCourse: Course) => (
              <div
                key={availableCourse.id}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`prereq-${availableCourse.id}`}
                  checked={watchedPrerequisites.includes(availableCourse.id)}
                  onCheckedChange={(checked) =>
                    handlePrerequisiteChange(
                      availableCourse.id,
                      checked as boolean
                    )
                  }
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor={`prereq-${availableCourse.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {availableCourse.courseCode} - {availableCourse.courseName}
                </Label>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Update Course" : "Create Course"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
