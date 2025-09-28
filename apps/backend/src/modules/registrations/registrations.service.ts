import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import {
  Registration,
  PaymentStatus,
  Grade,
} from '../../entities/registration.entity';
import { Course } from '../../entities/course.entity';
import { Student } from '../../entities/student.entity';
import { CoursesService } from '../courses/courses.service';
import { StudentsService } from '../students/students.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { BulkRegistrationDto } from './dto/bulk-registration.dto';

@Injectable()
export class RegistrationsService {
  constructor(
    @InjectRepository(Registration)
    private registrationsRepository: Repository<Registration>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    private coursesService: CoursesService,
    private studentsService: StudentsService,
  ) {}

  async create(
    createRegistrationDto: CreateRegistrationDto,
  ): Promise<Registration> {
    const { studentId, courseId, semester, year } = createRegistrationDto;

    // Check if student exists
    const student = await this.studentsService.findOne(studentId);

    // Check if course exists
    const course = await this.coursesService.findOne(courseId);

    // Check if already registered
    const existingRegistration = await this.registrationsRepository.findOne({
      where: { studentId, courseId, semester, year, isDropped: false },
    });

    if (existingRegistration) {
      throw new ConflictException(
        'Student is already registered for this course',
      );
    }

    // Check prerequisites
    const prerequisiteCheck = await this.coursesService.checkPrerequisites(
      studentId,
      courseId,
    );
    if (!prerequisiteCheck.canRegister) {
      throw new BadRequestException(
        `Missing prerequisites: ${prerequisiteCheck.missingPrerequisites.map((p) => p.courseName).join(', ')}`,
      );
    }

    // Check credit hour limit (18 credits max per semester)
    const currentCreditHours = await this.getCurrentSemesterCreditHours(
      studentId,
      semester,
      year,
    );
    if (currentCreditHours + course.creditHours > 18) {
      throw new BadRequestException(
        'Cannot exceed 18 credit hours per semester',
      );
    }

    // Create registration
    const registration = this.registrationsRepository.create({
      studentId,
      courseId,
      semester,
      year,
      paymentStatus: PaymentStatus.PENDING,
    });

    return this.registrationsRepository.save(registration);
  }

  async bulkRegister(
    studentId: number,
    bulkRegistrationDto: BulkRegistrationDto,
  ): Promise<Registration[]> {
    const { courseIds, semester, year } = bulkRegistrationDto;

    // Get courses
    const courses = await this.coursesRepository.find({
      where: { id: In(courseIds) },
    });

    if (courses.length !== courseIds.length) {
      throw new NotFoundException('One or more courses not found');
    }

    // Calculate total credit hours
    const totalCreditHours = courses.reduce(
      (sum, course) => sum + course.creditHours,
      0,
    );

    // Check current semester credit hours
    const currentCreditHours = await this.getCurrentSemesterCreditHours(
      studentId,
      semester,
      year,
    );

    if (currentCreditHours + totalCreditHours > 18) {
      throw new BadRequestException(
        'Total credit hours would exceed 18 credits per semester',
      );
    }

    // Check prerequisites for all courses
    const prerequisiteChecks = await Promise.all(
      courseIds.map((courseId) =>
        this.coursesService.checkPrerequisites(studentId, courseId),
      ),
    );

    const coursesWithMissingPrereqs = prerequisiteChecks
      .map((check, index) => ({ check, course: courses[index] }))
      .filter(({ check }) => !check.canRegister);

    if (coursesWithMissingPrereqs.length > 0) {
      const errorMessage = coursesWithMissingPrereqs
        .map(
          ({ course, check }) =>
            `${course.courseName}: Missing ${check.missingPrerequisites.map((p) => p.courseName).join(', ')}`,
        )
        .join('; ');

      throw new BadRequestException(`Prerequisites not met: ${errorMessage}`);
    }

    // Create all registrations
    const registrations = courseIds.map((courseId) =>
      this.registrationsRepository.create({
        studentId,
        courseId,
        semester,
        year,
        paymentStatus: PaymentStatus.PENDING,
      }),
    );

    return this.registrationsRepository.save(registrations);
  }

  async findAll(
    studentId?: string,
    semester?: string,
    year?: number,
  ): Promise<Registration[]> {
    const where: any = {};

    if (studentId) where.studentId = studentId;
    if (semester) where.semester = semester;
    if (year) where.year = year;

    return this.registrationsRepository.find({
      where,
      relations: ['course', 'student'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Registration> {
    const registration = await this.registrationsRepository.findOne({
      where: { id },
      relations: ['course', 'student'],
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    return registration;
  }

  async update(
    id: number,
    updateRegistrationDto: UpdateRegistrationDto,
  ): Promise<Registration> {
    const registration = await this.findOne(id);

    // If updating grade, calculate grade points and mark as completed
    if (updateRegistrationDto.grade) {
      registration.grade = updateRegistrationDto.grade;
      registration.gradePoints = registration.calculateGradePoints();
      registration.isCompleted = true;

      // Update student's GPA
      await this.studentsService.updateGPA(registration.studentId);
    }

    Object.assign(registration, updateRegistrationDto);
    return this.registrationsRepository.save(registration);
  }

  async drop(id: number): Promise<Registration> {
    const registration = await this.findOne(id);

    if (registration.isCompleted) {
      throw new BadRequestException('Cannot drop completed course');
    }

    // Check if within refund period (1 week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const canRefund = registration.createdAt > oneWeekAgo;

    registration.isDropped = true;
    registration.droppedAt = new Date();

    if (canRefund && registration.paymentStatus === PaymentStatus.PAID) {
      registration.paymentStatus = PaymentStatus.REFUNDED;
    }

    return this.registrationsRepository.save(registration);
  }

  async updatePaymentStatus(
    id: number,
    paymentStatus: PaymentStatus,
  ): Promise<Registration> {
    const registration = await this.findOne(id);
    registration.paymentStatus = paymentStatus;
    return this.registrationsRepository.save(registration);
  }

  async getStudentRegistrations(
    studentId: string,
    semester?: string,
    year?: number,
  ): Promise<Registration[]> {
    const where: any = { studentId, isDropped: false };

    if (semester) where.semester = semester;
    if (year) where.year = year;

    return this.registrationsRepository.find({
      where,
      relations: ['course'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCurrentSemesterCreditHours(
    studentId: number,
    semester: string,
    year: number,
  ): Promise<number> {
    const result = await this.registrationsRepository
      .createQueryBuilder('registration')
      .leftJoin('registration.course', 'course')
      .select('SUM(course.creditHours)', 'total')
      .where('registration.studentId = :studentId', { studentId })
      .andWhere('registration.semester = :semester', { semester })
      .andWhere('registration.year = :year', { year })
      .andWhere('registration.isDropped = false')
      .getRawOne();

    return parseInt(result?.total) || 0;
  }

  async getRegistrationSummary(
    studentId: string,
    semester: string,
    year: number,
  ) {
    const registrations = await this.getStudentRegistrations(
      studentId,
      semester,
      year,
    );

    const totalCreditHours = registrations.reduce(
      (sum, reg) => sum + reg.course.creditHours,
      0,
    );
    const totalCost = registrations.reduce(
      (sum, reg) => sum + reg.course.totalCost,
      0,
    );

    const paymentStatusCounts = registrations.reduce(
      (counts, reg) => {
        counts[reg.paymentStatus] = (counts[reg.paymentStatus] || 0) + 1;
        return counts;
      },
      {} as Record<PaymentStatus, number>,
    );

    return {
      registrations,
      summary: {
        totalCourses: registrations.length,
        totalCreditHours,
        totalCost,
        paymentStatusCounts,
      },
    };
  }
}
