import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationsService } from './registrations.service';
import { Registration, Grade } from '../../entities/registration.entity';
import { Student } from '../../entities/student.entity';
import { GraphQLAuthGuard } from '../auth/guards/graphql-auth.guard';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import {
  CreateRegistrationInput,
  BulkRegistrationInput,
  UpdateRegistrationInput,
} from './dto/registration.inputs';

interface SessionContext {
  req: any;
  res: any;
}

@Resolver(() => Registration)
export class RegistrationsResolver {
  constructor(
    private readonly registrationsService: RegistrationsService,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  @Query(() => [Registration], { name: 'getMyRegistrations' })
  @UseGuards(GraphQLAuthGuard)
  async getMyRegistrations(@Context() context: SessionContext) {
    const userId = context.req.session.userId;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Look up the student record from the database
    const student = await this.studentsRepository.findOne({
      where: { userId },
    });

    if (!student) {
      throw new Error('Student record not found');
    }

    return this.registrationsService.findByStudent(student.id);
  }

  @Query(() => [Registration], { name: 'getMyCurrentSemesterRegistrations' })
  @UseGuards(GraphQLAuthGuard)
  async getMyCurrentSemesterRegistrations(
    @Args('semester') semester: string,
    @Args('year', { type: () => Int }) year: number,
    @Context() context: SessionContext,
  ) {
    const userId = context.req.session.userId;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const student = await this.studentsRepository.findOne({
      where: { userId },
    });

    if (!student) {
      throw new Error('Student record not found');
    }

    return this.registrationsService.findByStudentAndSemester(
      student.id,
      semester,
      year,
    );
  }

  @Mutation(() => Registration, { name: 'registerForCourse' })
  @UseGuards(GraphQLAuthGuard)
  async registerForCourse(
    @Args('registerInput') registerInput: CreateRegistrationInput,
    @Context() context: SessionContext,
  ) {
    const userId = context.req.session.userId;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const student = await this.studentsRepository.findOne({
      where: { userId },
    });

    if (!student) {
      throw new Error('Student record not found');
    }

    const createDto = {
      studentId: student.id,
      courseId: registerInput.courseId,
      semester: registerInput.semester,
      year: registerInput.year,
    };

    return this.registrationsService.create(createDto);
  }

  @Mutation(() => [Registration], { name: 'bulkRegisterForCourses' })
  @UseGuards(GraphQLAuthGuard)
  async bulkRegisterForCourses(
    @Args('bulkRegisterInput') bulkRegisterInput: BulkRegistrationInput,
    @Context() context: SessionContext,
  ) {
    const userId = context.req.session.userId;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const student = await this.studentsRepository.findOne({
      where: { userId },
    });

    if (!student) {
      throw new Error('Student record not found');
    }

    const bulkDto = {
      studentId: student.id,
      courseIds: bulkRegisterInput.courseIds,
      semester: bulkRegisterInput.semester,
      year: bulkRegisterInput.year,
    };

    return this.registrationsService.bulkRegister(student.id, bulkDto);
  }

  @Mutation(() => String, { name: 'dropCourse' })
  @UseGuards(GraphQLAuthGuard)
  async dropCourse(
    @Args('registrationId', { type: () => Int }) registrationId: number,
    @Context() context: SessionContext,
  ) {
    const user = context.req.session.user;

    if (!user) {
      throw new Error('User not found in session');
    }

    await this.registrationsService.drop(registrationId);
    return 'Course dropped successfully';
  }

  // Admin only endpoints
  @Query(() => [Registration], { name: 'getAllRegistrations' })
  @UseGuards(AdminAuthGuard)
  async getAllRegistrations() {
    return this.registrationsService.getAllRegistrations();
  }

  @Mutation(() => Registration, { name: 'assignGrade' })
  @UseGuards(AdminAuthGuard)
  async assignGrade(
    @Args('registrationId', { type: () => Int }) registrationId: number,
    @Args('grade') grade: Grade,
  ) {
    return this.registrationsService.assignGrade(registrationId, grade);
  }
}
