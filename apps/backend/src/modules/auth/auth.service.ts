import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Student } from '../../entities/student.entity';
import { User, UserRole } from '../../entities/user.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { LoginDto } from './dto/login.dto';
import {
  LoginInput,
  RegisterInput,
  AdminLoginInput,
  CreateStudentInput,
} from './dto/auth.inputs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async register(createStudentDto: CreateStudentDto) {
    const { studentId, email, password, firstName, lastName } =
      createStudentDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if student ID already exists
    const existingStudent = await this.studentsRepository.findOne({
      where: { studentId },
    });

    if (existingStudent) {
      throw new ConflictException('Student with this ID already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.STUDENT,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create student record
    const student = this.studentsRepository.create({
      studentId,
      userId: savedUser.id,
      user: savedUser,
    });

    await this.studentsRepository.save(student);

    // Return user without password
    const { password: _, ...result } = savedUser;
    return { ...result, studentId };
  }

  async validateUser(studentId: number, password: string): Promise<any> {
    const student = await this.studentsRepository.findOne({
      where: { studentId },
      relations: ['user'],
    });

    if (
      student &&
      student.user &&
      student.user.isActive &&
      (await bcrypt.compare(password, student.user.password))
    ) {
      const { password: _, ...userResult } = student.user;
      return { ...userResult, studentId: student.studentId };
    }

    return null;
  }

  async login(loginDto: LoginDto) {
    const { studentId, password } = loginDto;
    const user = await this.validateUser(studentId, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user,
      message: 'Login successful',
    };
  }

  async loginGraphQL(loginInput: LoginInput) {
    const { studentId, password } = loginInput;
    const user = await this.validateUser(studentId, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user,
      message: 'Login successful',
    };
  }

  async registerGraphQL(registerInput: RegisterInput) {
    const { studentId, email, password, firstName, lastName } = registerInput;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if student ID already exists
    const existingStudent = await this.studentsRepository.findOne({
      where: { studentId },
    });

    if (existingStudent) {
      throw new ConflictException('Student with this ID already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.STUDENT,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create student record
    const student = this.studentsRepository.create({
      studentId,
      userId: savedUser.id,
      user: savedUser,
    });

    await this.studentsRepository.save(student);

    // Return user without password
    const { password: _, ...result } = savedUser;
    return { ...result, studentId };
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id, isActive: true },
      relations: ['student'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createAdmin(createStudentDto: CreateStudentDto) {
    const { email, password, firstName, lastName } = createStudentDto;

    // Check if admin already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin
    const admin = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.ADMIN,
    });

    const savedAdmin = await this.usersRepository.save(admin);

    // Return admin without password
    const { password: _, ...result } = savedAdmin;
    return result;
  }

  async validateAdmin(email: string, password: string): Promise<any> {
    const admin = await this.usersRepository.findOne({
      where: { email, role: UserRole.ADMIN, isActive: true },
    });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const { password: _, ...result } = admin;
      return result;
    }

    return null;
  }

  async adminLoginGraphQL(adminLoginInput: AdminLoginInput) {
    const { email, password } = adminLoginInput;
    const admin = await this.validateAdmin(email, password);

    if (!admin) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    return {
      user: admin,
      message: 'Admin login successful',
    };
  }

  async createStudentGraphQL(createStudentInput: CreateStudentInput) {
    const { studentId, email, password, firstName, lastName } =
      createStudentInput;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if student ID already exists
    const existingStudent = await this.studentsRepository.findOne({
      where: { studentId },
    });

    if (existingStudent) {
      throw new ConflictException('Student with this ID already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.STUDENT,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create student record
    const student = this.studentsRepository.create({
      studentId,
      userId: savedUser.id,
      user: savedUser,
    });

    await this.studentsRepository.save(student);

    // Return user without password
    const { password: _, ...result } = savedUser;
    return { ...result, studentId };
  }

  async getAllStudents(): Promise<any[]> {
    const students = await this.studentsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return students.map((student) => {
      const { password: _, ...userResult } = student.user;
      return { ...userResult, studentId: student.studentId };
    });
  }
}
