import { Injectable, Req, HttpException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { Wallet } from './wallet.entity';
import {User} from '../userController/user.entity';
import { walletTransaction } from 'src/types/types';
import { WalletTransaction } from './wallet.transaction.entity';

@Injectable()
export class WalletService {
    constructor(private dataSource: DataSource) {}

 

  public async createWallet(@Req() request: Request & {user: User}):Promise<void> {
    const { currency } = request.body
    const userId = request.user.id
    const userData = await this.dataSource.getRepository(User).findOne({where:{id:userId } });

    if(!userData) {
        throw new HttpException('User Does not exist', 400); 
    }
    const wallet: Wallet = new Wallet();
    wallet.currency = currency;
    wallet.userId = userId;
    
    await this.dataSource.transaction(async transaction => {
       await transaction.getRepository('Wallet').save(wallet)
    })
    
  }

  public async fundMyWallet(request:Request  & {user: User} ): Promise<void>{
    const {walletId, amount} = request.body;
    const userId = request.user.id
    if(!walletId){
      throw new HttpException("WalletId not found", 400);
    }else if(!userId){
      throw new HttpException("User not found", 400);
    }else if(!amount){
      throw new HttpException("Please update amount to complete transaction", 400)
    }
    
    const userData =  await this.dataSource.getRepository(Wallet)
    .createQueryBuilder("wallet")
    .select('wallet.id', 'walletId')
    .addSelect('wallet.walletAmount', 'walletAmount')
    .where('wallet.userId = :userId', { userId })
    .andWhere('wallet.id = :walletId', { walletId })
    .getRawOne() as {userId:string, walletId:string, walletAmount: number};

    if(!userData){
      throw new HttpException('Wallet not found', 400);
    }

    const newAmount = userData.walletAmount + Number(amount);
    
    //Update Wallet Balance
    await this.dataSource.transaction(async transactionManager =>{
     await transactionManager.createQueryBuilder().update(Wallet)
     .set({walletAmount: newAmount})
     .where('id = :walletId',{walletId})
     .execute()
    })
  } 

  public async sendFunds(request: Request & {user: User}): Promise<Record<string, unknown>>{
    const {senderWalletId, receiverWalletAddress, amount} = request.body;
    const userId = request.user.id

    //Check if senderWallerId and ReceiverWallerAddress is Empty
    if(!senderWalletId || !receiverWalletAddress){
      throw new HttpException('senderWalletId or receiverWalletAddress cannot be empty, Please fill and try again', 400);
    }else if(!amount){
      throw new HttpException('amount cannot be empty, Please fill and try again', 400);
    }

    //Check if sender waller address exist
    const findWallet = await this.dataSource.getRepository(Wallet).findOne({where:{id: senderWalletId,userId }});

    //Check if recipient waller address exist
    const findRecipientWallet = await this.dataSource.getRepository(Wallet).findOne({where:{walletAddress: receiverWalletAddress}});
    if(!findWallet){
      throw new HttpException('sender not found on our database', 400);
    }else if(!findRecipientWallet){
      throw new HttpException('recipient not found on our database', 400);
    }

    if(findWallet.walletAmount < amount){
      throw new HttpException('Insufficient funds', 400);
    }

   const newSenderBalance = findWallet.walletAmount - Number(amount);
   const newRecipientBalance = findRecipientWallet.walletAmount + Number(amount);

   //Verify if amount is greater than 1million
   if(amount > 1000000){
    //Record data on transaction table  
      const transaction = new WalletTransaction();
      transaction.isApproved = false;
      transaction.transactionType = walletTransaction.DEBIT,
      transaction.amount = amount
      transaction.walletId = senderWalletId
      transaction.recipientWalletId = Number(findRecipientWallet.id)
      await this.dataSource.transaction(async transactionManager =>{
        await transactionManager.getRepository('WalletTransaction').save(transaction)
      })

      return {message: 'Transaction over 1000000 will require approval from admin..Please wait'};
   }

   
   //Record data on transaction table
   const transaction = new WalletTransaction();
   transaction.isApproved = true;
   transaction.transactionType = walletTransaction.DEBIT,
   transaction.amount = amount
   transaction.walletId = senderWalletId
   transaction.recipientWalletId = Number(findRecipientWallet.id)
   await this.dataSource.transaction(async transactionManager =>{
     await transactionManager.getRepository('WalletTransaction').save(transaction)
   })

  //Update sender balance
   await this.dataSource.transaction(async transactionManager =>{
    await transactionManager.createQueryBuilder().update(Wallet)
    .set({walletAmount: newSenderBalance})
    .where('id = :senderWalletId',{senderWalletId})
    .execute()
   })


   //Update Recipient balance
   await this.dataSource.transaction(async transactionManager =>{
    await transactionManager.createQueryBuilder().update(Wallet)
    .set({walletAmount: newRecipientBalance})
    .where('walletAddress = :receiverWalletAddress',{receiverWalletAddress})
    .execute()
   })
   return {message: 'Transaction successful'}
  }
  
  public async approveTransaction(request: Request): Promise<Record<string, unknown>>{
    const {transactionId} = request.body;
    if(!transactionId){
      throw new HttpException('TransactionId cannot be empty', 400);
    }
    const findTransaction = await this.dataSource.getRepository(WalletTransaction).findOne({where:{id:transactionId}});

    if(!findTransaction){
      throw new HttpException('Invalid Transaction', 400);
    }

    if(findTransaction.isApproved){
      throw new HttpException('Already Approved', 400);
    }

    const findSenderWallet = await this.dataSource.getRepository(Wallet).findOne({where:{id: String(findTransaction.walletId) }});
  
    //Check if recipient wallet address exist
    const findRecipientWallet = await this.dataSource.getRepository(Wallet).findOne({where:{id: String(findTransaction.recipientWalletId)}});

    const newSenderBalance = findSenderWallet!.walletAmount - Number(findTransaction.amount);
    const newRecipientBalance = findRecipientWallet!.walletAmount + Number(findTransaction.amount);

    const senderWalletId = findTransaction.walletId
    const receiverWalletId = findTransaction.recipientWalletId

    await this.dataSource.transaction(async transactionManager =>{
      await transactionManager.createQueryBuilder().update(WalletTransaction)
      .set({isApproved: true})
      .where('id = :transactionId',{transactionId})
      .execute()
    })

    await this.dataSource.transaction(async transactionManager =>{
      await transactionManager.createQueryBuilder().update(Wallet)
      .set({walletAmount: newSenderBalance})
      .where('id = :senderWalletId',{senderWalletId})
      .execute()
     })
  
  
     //Update Recipient balance
     await this.dataSource.transaction(async transactionManager =>{
      await transactionManager.createQueryBuilder().update(Wallet)
      .set({walletAmount: newRecipientBalance})
      .where('id = :receiverWalletId',{receiverWalletId})
      .execute()
     })

     return {message:'Approved'}
  }
}