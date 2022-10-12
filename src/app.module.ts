import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { UserController } from './controller/userController/user.controller';
import { User } from './controller/userController/user.entity';
import { UserService } from './controller/userController/user.service';
import { Wallet } from './controller/walletController/wallet.entity';
import { WalletController } from './controller/walletController/wallet.controller';
import { WalletService } from './controller/walletController/wallet.service';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forFeature([User, Wallet]),
  ],
  controllers: [AppController, UserController, WalletController],
  providers: [AppService, UserService, WalletService],
})
export class AppModule {}