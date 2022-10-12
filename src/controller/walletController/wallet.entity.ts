import { Entity, PrimaryGeneratedColumn, Column, Index,Generated, UpdateDateColumn, ManyToOne,OneToMany, DeleteDateColumn, OneToOne } from 'typeorm';
import {User} from '../userController/user.entity';
import { WalletTransaction } from './wallet.transaction.entity';

@Entity()
export class Wallet{
    @PrimaryGeneratedColumn({
        type: 'bigint',
        unsigned: true,
    })
    id!: string;

    @Column()
    @Generated("uuid")
    walletAddress!: string;

    @Column({type: 'float', unsigned: true, default: '100000.00'})
    walletAmount!:number

    @Column({type: 'varchar', nullable: false})
    currency!:string

    @Index()
    @Column({ type: 'bigint', nullable:true })
    userId!:number;

    @ManyToOne(() => User, (user) => user.wallet) 
    user: User | undefined

    @OneToMany(()=> WalletTransaction, (walletTransaction)=> walletTransaction.wallet)
    walletTransaction!: WalletTransaction
}