import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { walletTransaction } from 'src/typings/types';
import { Wallet } from './wallet.entity';
@Entity()
export class WalletTransaction{
    @PrimaryGeneratedColumn()
    public id!: string;

    @Column({type: 'boolean', default: true, nullable: false})
    public isApproved!: boolean;

    @Column({type: 'float', unsigned: true, nullable: false})
    public amount!:number

    @Column({type:"enum", enum:walletTransaction})
    public transactionType!:walletTransaction

    @Index()
    @Column({ type: 'bigint', nullable:false })
    public walletId!:number

    @Index()
    @Column({ type: 'bigint', nullable:false })
    public recipientWalletId!:number

    @ManyToOne(()=> Wallet, (wallet)=> wallet.walletTransaction)
    wallet!:Wallet
}