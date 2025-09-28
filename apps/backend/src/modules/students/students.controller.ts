import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('me')
  getProfile(@Request() req) {
    return this.studentsService.findOne(req.user.id);
  }

  @Get('me/transcript')
  getMyTranscript(@Request() req) {
    return this.studentsService.getTranscript(req.user.id);
  }

  @Get('me/statistics')
  getMyStatistics(@Request() req) {
    return this.studentsService.getStudentStatistics(req.user.id);
  }

  @Get('me/gpa')
  getCurrentSemesterGPA(
    @Request() req,
    @Query('semester') semester: string,
    @Query('year') year: number,
  ) {
    return this.studentsService.getCurrentSemesterGPA(
      req.user.id,
      semester,
      year,
    );
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id/transcript')
  getTranscript(@Param('id') id: string) {
    return this.studentsService.getTranscript(+id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id/statistics')
  getStatistics(@Param('id') id: string) {
    return this.studentsService.getStudentStatistics(+id);
  }

  @Patch('me')
  updateProfile(@Request() req, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(req.user.id, updateStudentDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}
