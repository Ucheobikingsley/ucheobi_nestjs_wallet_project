
import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, HttpException, Req } from '@nestjs/common';
import { readValidatePostBody, handleErrors } from '../../lib/helper';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  @Inject(UserService)
    private readonly service!: UserService;

  @Get(':id')
  public getUser(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.service.getUser(id);
  }

  @Post()
    public async createUser(@Body() body: CreateUserDto): Promise<Record<string, unknown>> {
    const [dto, validationErrors] = await readValidatePostBody(CreateUserDto,body);
    if(validationErrors.length > 0){
      throw new HttpException(validationErrors, 400); 
    }
    return this.service.createUser(body);
  }

  @Post('login')
  public async login(@Req() req: Request): Promise<Record<string, unknown>> {
    return this.service.login(req);
  }
}