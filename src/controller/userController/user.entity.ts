import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Wallet } from '../walletController/wallet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 120 })
    public name: string | undefined;

  @Column({ type: 'varchar', length: 120 })
    public email!: string;
    

  @Column({ type: 'text', default: '', nullable: false })
  public password!:string;

  @Column({ type: 'text', default: '', nullable: false})
  @Index({ unique: true })
  public phonenumber!:string;

  @Column({ type: 'boolean', default: false, nullable: false})
  public isAdmin!:boolean;

  @Column({ type: 'boolean', default: false })
  public isDeleted!: boolean;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;


  @OneToMany(()=> Wallet, (wallet)=> wallet.user,{
    cascade: true,
  })
  wallet: Wallet[] | undefined
}
