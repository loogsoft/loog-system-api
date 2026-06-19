import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { UserRequestDto } from 'src/dtos/request/user-request.dto';
import { UserResponseDto } from 'src/dtos/response/user-response.dto';
import { LoginRequestDto } from 'src/dtos/request/login-request.dto';
import { LoginResponseDto } from 'src/dtos/response/login-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VerifyCoderequestDto } from 'src/dtos/request/verification-code-request.dto';
import type { Request as ExpressRequest } from 'express';
import { UpdatePasswordRequestDto } from 'src/dtos/request/update-password-request.dto';

type AuthenticatedRequest = ExpressRequest & {
  user: {
    id: string;
    email: string;
  };
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() dto: UserRequestDto): Promise<UserResponseDto> {
    return this.usersService.create(dto);
  }

  @Post('/verify-email')
  verifyEmail(@Body() dto: LoginRequestDto): Promise<{ companyId: string }> {
    return this.usersService.verifyEmail(dto);
  }

  @Post('verify-code')
  verifyCode(@Body() dto: VerifyCoderequestDto): Promise<LoginResponseDto> {
    return this.usersService.validateUser(dto.email, dto.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: AuthenticatedRequest): AuthenticatedRequest['user'] {
    return req.user;
  }

  @Get('find-all')
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<UserRequestDto>,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/update-password')
  updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordRequestDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updatePassword(id, dto);
  }
}
