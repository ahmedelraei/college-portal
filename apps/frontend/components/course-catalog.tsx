"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, Search, Filter, Clock, Users, MapPin, AlertTriangle, CheckCircle } from "lucide-react"

const courses = [
  {
    id: "CS401",
    name: "Advanced Machine Learning",
    department: "Computer Science",
    credits: 4,
    instructor: "Dr. Emily Watson",
    schedule: "MWF 10:00-11:00",
    location: "Science Building 201",
    capacity: 30,
    enrolled: 25,
    prerequisites: ["CS301", "MATH250"],
    description: "Advanced topics in machine learning including deep learning, neural networks, and AI applications.",
    tuition: 1200,
    available: true,
  },
  {
    id: "CS402",
    name: "Distributed Systems",
    department: "Computer Science",
    credits: 3,
    instructor: "Prof. James Miller",
    schedule: "TTh 14:00-15:30",
    location: "Tech Center 105",
    capacity: 25,
    enrolled: 23,
    prerequisites: ["CS305", "CS320"],
    description: "Design and implementation of distributed computing systems, fault tolerance, and scalability.",
    tuition: 900,
    available: true,
  },
  {
    id: "MATH301",
    name: "Linear Algebra",
    department: "Mathematics",
    credits: 3,
    instructor: "Dr. Sarah Chen",
    schedule: "MWF 09:00-10:00",
    location: "Math Building 301",
    capacity: 40,
    enrolled: 35,
    prerequisites: ["MATH250"],
    description: "Vector spaces, linear transformations, eigenvalues, and applications.",
    tuition: 900,
    available: true,
  },
  {
    id: "CS403",
    name: "Computer Graphics",
    department: "Computer Science",
    credits: 4,
    instructor: "Dr. Michael Brown",
    schedule: "TTh 10:00-12:00",
    location: "Graphics Lab 150",
    capacity: 20,
    enrolled: 20,
    prerequisites: ["CS301", "MATH301"],
    description: "3D graphics, rendering algorithms, and interactive computer graphics programming.",
    tuition: 1200,
    available: false,
  },
  {
    id: "ENG201",
    name: "Advanced Technical Writing",
    department: "English",
    credits: 2,
    instructor: "Prof. Lisa Johnson",
    schedule: "MW 15:00-16:00",
    location: "Humanities 205",
    capacity: 25,
    enrolled: 18,
    prerequisites: ["ENG102"],
    description: "Advanced writing techniques for technical documentation and professional communication.",
    tuition: 600,
    available: true,
  },
]

const studentCompletedCourses = ["CS301", "CS305", "CS320", "MATH250", "ENG102"] // Mock completed courses

export function CourseCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState<(typeof courses)[0] | null>(null)
  const [registeredCourses, setRegisteredCourses] = useState<string[]>([])

  const departments = ["all", ...Array.from(new Set(courses.map((course) => course.department)))]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const checkPrerequisites = (course: (typeof courses)[0]) => {
    return course.prerequisites.every((prereq) => studentCompletedCourses.includes(prereq))
  }

  const handleRegister = (courseId: string) => {
    setRegisteredCourses([...registeredCourses, courseId])
  }

  const isRegistered = (courseId: string) => registeredCourses.includes(courseId)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-university-navy mb-2">Course Catalog</h1>
        <p className="text-slate-600">Browse and register for courses - Spring 2024</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search courses by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">Available Courses</TabsTrigger>
          <TabsTrigger value="registered">My Registrations ({registeredCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <div className="grid gap-6">
            {filteredCourses.map((course) => {
              const hasPrerequisites = checkPrerequisites(course)
              const canRegister = course.available && hasPrerequisites && !isRegistered(course.id)

              return (
                <Card key={course.id} className="border-l-4 border-l-university-navy">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-university-navy">{course.id}</h3>
                          <Badge variant="secondary">{course.credits} credits</Badge>
                          <Badge variant="outline">{course.department}</Badge>
                          {!course.available && <Badge variant="destructive">Full</Badge>}
                          {isRegistered(course.id) && (
                            <Badge className="bg-green-100 text-green-800 border-green-300">Registered</Badge>
                          )}
                        </div>

                        <h4 className="text-lg font-medium text-slate-900 mb-2">{course.name}</h4>
                        <p className="text-slate-600 mb-3">{course.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-slate-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {course.schedule}
                          </div>
                          <div className="flex items-center text-slate-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {course.location}
                          </div>
                          <div className="flex items-center text-slate-600">
                            <Users className="h-4 w-4 mr-2" />
                            {course.enrolled}/{course.capacity} enrolled
                          </div>
                        </div>

                        {course.prerequisites.length > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            {hasPrerequisites ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                            )}
                            <span className="text-sm text-slate-600">
                              Prerequisites: {course.prerequisites.join(", ")}
                              {!hasPrerequisites && " (Not met)"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-sm text-slate-600">Instructor</p>
                          <p className="font-medium text-university-navy">{course.instructor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600">Tuition</p>
                          <p className="text-lg font-bold text-university-navy">£{course.tuition}</p>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course)}>
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-university-navy">
                                  {selectedCourse?.id} - {selectedCourse?.name}
                                </DialogTitle>
                                <DialogDescription>
                                  {selectedCourse?.department} • {selectedCourse?.credits} Credits
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p className="text-slate-700">{selectedCourse?.description}</p>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-university-navy mb-2">Course Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">Instructor:</span>
                                        <span>{selectedCourse?.instructor}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">Schedule:</span>
                                        <span>{selectedCourse?.schedule}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">Location:</span>
                                        <span>{selectedCourse?.location}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">Tuition:</span>
                                        <span className="font-semibold">£{selectedCourse?.tuition}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-university-navy mb-2">Enrollment</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">Capacity:</span>
                                        <span>{selectedCourse?.capacity}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">Enrolled:</span>
                                        <span>{selectedCourse?.enrolled}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-slate-600">Available:</span>
                                        <span>
                                          {selectedCourse?.capacity && selectedCourse?.enrolled
                                            ? selectedCourse.capacity - selectedCourse.enrolled
                                            : 0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {selectedCourse?.prerequisites && selectedCourse.prerequisites.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-university-navy mb-2">Prerequisites</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedCourse.prerequisites.map((prereq) => (
                                        <Badge
                                          key={prereq}
                                          variant={studentCompletedCourses.includes(prereq) ? "default" : "destructive"}
                                        >
                                          {prereq}
                                          {studentCompletedCourses.includes(prereq) ? " ✓" : " ✗"}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            size="sm"
                            disabled={!canRegister}
                            onClick={() => handleRegister(course.id)}
                            className="bg-university-navy hover:bg-university-navy/90"
                          >
                            {isRegistered(course.id) ? "Registered" : "Register"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="registered">
          <div className="space-y-6">
            {registeredCourses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Registered Courses</h3>
                  <p className="text-slate-600">You haven't registered for any courses yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {courses
                  .filter((course) => registeredCourses.includes(course.id))
                  .map((course) => (
                    <Card key={course.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-university-navy">{course.id}</h3>
                              <Badge className="bg-green-100 text-green-800 border-green-300">Registered</Badge>
                              <Badge variant="secondary">{course.credits} credits</Badge>
                            </div>
                            <h4 className="text-lg font-medium text-slate-900 mb-2">{course.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {course.schedule}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {course.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-university-navy">£{course.tuition}</p>
                            <p className="text-sm text-slate-600">{course.instructor}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                <Card className="bg-university-navy text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Registration Summary</h3>
                        <p className="text-blue-100">
                          Total Credits:{" "}
                          {courses
                            .filter((course) => registeredCourses.includes(course.id))
                            .reduce((sum, course) => sum + course.credits, 0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          £
                          {courses
                            .filter((course) => registeredCourses.includes(course.id))
                            .reduce((sum, course) => sum + course.tuition, 0)}
                        </p>
                        <p className="text-blue-100">Total Tuition</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
