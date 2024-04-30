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
import {Tenant} from '../tenant/tenant.entity';
import {User} from '../user/user.entity';

@Entity('NetPromoteScore', {schema: 'public'})
export class NetPromoteScore {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn({
    name: 'tenantId',
    referencedColumnName: 'id',
  })
  public tenant: Tenant;

  @Column({type: 'uuid', name: 'userId'})
  public userId: string;

  @ManyToOne(() => User, {persistence: false})
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'id',
    },
  ])
  public user: User;

  @Column({
    type: 'int',
    nullable: true,
  })
  public rate: number;

  @Column({type: 'text'})
  public comment: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<NetPromoteScore>) {
    Object.assign(this, data);
  }
}
