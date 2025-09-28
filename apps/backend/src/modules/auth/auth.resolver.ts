import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginInput,
  RegisterInput,
  AdminLoginInput,
  CreateStudentInput,
} from './dto/auth.inputs';
import { LoginResponse, LogoutResponse, User } from './types/auth.types';
import { UserRole } from '../../entities/user.entity';

interface SessionContext {
  req: any;
  res: any;
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: SessionContext,
  ): Promise<LoginResponse> {
    const result = await this.authService.loginGraphQL(loginInput);

    // Store user session
    context.req.session.userId = result.user.id;
    context.req.session.user = result.user;

    return result;
  }

  @Mutation(() => User)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<User> {
    return this.authService.registerGraphQL(registerInput);
  }

  @Mutation(() => LogoutResponse)
  async logout(@Context() context: SessionContext): Promise<LogoutResponse> {
    context.req.session.destroy();
    return { message: 'Logged out successfully' };
  }

  @Query(() => User, { nullable: true })
  async me(@Context() context: SessionContext): Promise<User | null> {
    const userId = context.req.session.userId;
    if (!userId) {
      return null;
    }

    try {
      const user = await this.authService.findById(userId);
      return user;
    } catch (error) {
      return null;
    }
  }

  @Query(() => Boolean)
  async isAuthenticated(@Context() context: SessionContext): Promise<boolean> {
    const userId = context.req.session.userId;
    return !!userId;
  }

  @Mutation(() => LoginResponse)
  async adminLogin(
    @Args('adminLoginInput') adminLoginInput: AdminLoginInput,
    @Context() context: SessionContext,
  ): Promise<LoginResponse> {
    const result = await this.authService.adminLoginGraphQL(adminLoginInput);

    // Store admin session
    context.req.session.userId = result.user.id;
    context.req.session.user = result.user;

    return result;
  }

  @Mutation(() => User)
  async createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
    @Context() context: SessionContext,
  ): Promise<User> {
    // Check if user is admin (simple check for now)
    const userId = context.req.session.userId;
    if (!userId) {
      throw new Error('Unauthorized: Admin access required');
    }

    const currentUser = await this.authService.findById(userId);
    if (currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized: Admin access required');
    }

    return this.authService.createStudentGraphQL(createStudentInput);
  }

  @Query(() => [User])
  async getAllStudents(@Context() context: SessionContext): Promise<User[]> {
    // Check if user is admin
    const userId = context.req.session.userId;
    if (!userId) {
      throw new Error('Unauthorized: Admin access required');
    }

    const currentUser = await this.authService.findById(userId);
    if (currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized: Admin access required');
    }

    return this.authService.getAllStudents();
  }
}
