import { Body, Controller, Get, Inject, Post, HttpException, Req, UseGuards, Patch } from '@nestjs/common';
import {WalletService} from './wallet.service';
import {Request} from 'express';

import {User} from '../userController/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserRole } from 'src/types/types';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
@Controller('user/wallet')
export class WalletController{
    @Inject(WalletService)
    private readonly service!: WalletService;

    @Post()
    @UseGuards(AuthGuard)
    public async createWallet(@Req() request: Request  & {user: User}): Promise<void> {
    return this.service.createWallet(request)
   }
    @Patch('me')
    @UseGuards(AuthGuard)
    public async fundMyWallet(@Req() request:Request & {user: User}): Promise<void> {
      return this.service.fundMyWallet(request)
    }

    @Patch('send')
    @UseGuards(AuthGuard)
    public async sendFunds(@Req() request:Request & {user: User}): Promise<Record<string, unknown>> {
      return this.service.sendFunds(request)
    }

    @Patch('approval')
    @UseGuards(RolesGuard)
    public async approval(@Req() request:Request & {user: User}): Promise<Record<string, unknown>> {
      return this.service.approveTransaction(request)
    }
}