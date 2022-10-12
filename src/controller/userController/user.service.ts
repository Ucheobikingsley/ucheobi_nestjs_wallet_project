import { Injectable, HttpException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { hash } from 'bcrypt';
import { merge } from 'lodash';
import { Request } from 'express';
import {compare} from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { sign, Secret } from 'jsonwebtoken';
@Injectable()
export class UserService {
  @Inject(ConfigService)
    private readonly config!: ConfigService;
  @InjectRepository(User)
    private readonly repository!: Repository<User>;
    

  public getUser(id: any): Promise<User | null> {
    return this.repository.findOne(id);
  }

  public async createUser(body: CreateUserDto): Promise<User> {
    const user: User = new User();
    
   //hash password with bcrypt
    const encryptedPasssword = await hash(body.password, Number(this.config.get<number>('SALT_ROUNDS')))
    if(!encryptedPasssword){
        console.log("Password", encryptedPasssword)
        throw new HttpException('Could not encrypt password, Please try again', 400); 
    }
    const userData = merge(user, body)
    userData.password = encryptedPasssword;
    return this.repository.save(user);
  }

  public async login(request: Request){

    const {phonenumber,password} = request.body;
   
    if(!phonenumber || !password){
      throw new HttpException('phonenumber or password cannot be empty', 400);
    }
    const findUser = await this.repository.findOne({where:{phonenumber:phonenumber}});
    if(!findUser) throw new HttpException('user does not exist with this phonenumber', 400);
    
    const match = await compare(password,  findUser.password);

    if(!match) {
      throw new HttpException('password is incorrect', 400);
    }
    console.log('log', findUser)
    const token = sign({ ...findUser }, String(this.config.get<string>('ACCESS_TOKEN')));
    return {token};
  }
}