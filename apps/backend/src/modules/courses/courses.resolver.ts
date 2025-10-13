import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from '../../entities/course.entity';
import {
  CreateCourseInput,
  UpdateCourseInput,
  CourseFilterInput,
} from './dto/course.inputs';
import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '../auth/guards/graphql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Query(() => [Course], { name: 'getAllCourses' })
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllCourses(
    @Args('filters', { nullable: true }) filters?: CourseFilterInput,
  ) {
    return this.coursesService.findAllFromGraphQL(filters);
  }

  @Query(() => [Course], { name: 'getAvailableCourses' })
  @UseGuards(GraphQLAuthGuard)
  async getAvailableCourses(
    @Args('filters', { nullable: true }) filters?: CourseFilterInput,
  ) {
    return this.coursesService.findAllFromGraphQL(filters);
  }

  @Query(() => Course, { name: 'getCourseById' })
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getCourseById(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.findOne(id);
  }

  @Mutation(() => Course, { name: 'createCourse' })
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createCourse(
    @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ) {
    return this.coursesService.createFromGraphQL(createCourseInput);
  }

  @Mutation(() => Course, { name: 'updateCourse' })
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateCourse(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCourseInput') updateCourseInput: UpdateCourseInput,
  ) {
    return this.coursesService.updateFromGraphQL(id, updateCourseInput);
  }

  @Mutation(() => String, { name: 'deleteCourse' })
  @UseGuards(GraphQLAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCourse(@Args('id', { type: () => Int }) id: number) {
    await this.coursesService.remove(id);
    return 'Course deleted successfully';
  }
}
