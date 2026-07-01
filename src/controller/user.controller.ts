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
  Req,
} from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { UserRequestDto } from 'src/dtos/request/user-request.dto';
import { UserResponseDto } from 'src/dtos/response/user-response.dto';
import { LoginRequestDto } from 'src/dtos/request/login-request.dto';
import { LoginResponseDto } from 'src/dtos/response/login-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { VerifyCoderequestDto } from 'src/dtos/request/verification-code-request.dto';
import { UpdatePasswordRequestDto } from 'src/dtos/request/update-password-request.dto';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

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

  @UseGuards(JwtAuthGuard)
  @Get('find-all')
  findAll(@Req() req: AuthenticatedRequest): Promise<UserResponseDto[]> {
    return this.usersService.findAll(req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    return this.usersService.findOne(id, req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<UserRequestDto>,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, dto, req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.usersService.remove(id, req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/update-password')
  updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    return this.usersService.updatePassword(id, dto, req.user.companyId);
  }
}
