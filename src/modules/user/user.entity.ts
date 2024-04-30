import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import {UserProfile} from '../userProfile/userProfile.entity';
import {Client} from '../client/client.entity';
import {TenantUser} from '../tenantUser/tenantUser.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid')
  public clientId: string;

  @ManyToOne(() => Client, {persistence: false})
  @JoinColumn({
    name: 'clientId',
    referencedColumnName: 'id',
  })
  public client: Client;

  @Column('uuid')
  public B2CId: string;

  @Column({type: 'varchar', length: 255, unique: true})
  public email: string;

  @Column({type: 'text'})
  public clientTraceId: string;

  @Column('boolean')
  public emailNotifications: boolean;

  @Column({type: 'boolean', default: false})
  public inactive: boolean;

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {persistence: false})
  userProfile: UserProfile;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => TenantUser, (tenantUser) => tenantUser.user, {persistence: false})
  @JoinColumn([{name: 'id', referencedColumnName: 'userId'}])
  public tenantUsers: TenantUser[];

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}
