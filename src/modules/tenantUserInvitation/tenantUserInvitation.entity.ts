import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {TenantUser} from '../tenantUser/tenantUser.entity';

@Entity('TenantUserInvitation')
export class TenantUserInvitation {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn({type: 'integer'})
  public tenantId: number;

  @Column({type: 'uuid', name: 'userId'})
  public userId: string;

  @ManyToOne(() => TenantUser, {persistence: false})
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'userId',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public tenantUser: TenantUser;

  @Column({type: 'text'})
  public email: string;

  @Column({type: 'text'})
  public invitationLink: string;

  @Column({type: 'timestamptz'})
  public dateExpiry: Date;

  @Column({type: 'boolean'})
  public isActive: boolean;

  @Column({type: 'timestamptz'})
  public acceptedAt: Date;

  @Column({type: 'text'})
  public language?: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<TenantUserInvitation>) {
    Object.assign(this, data);
  }
}
