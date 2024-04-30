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
import {FileEntityName} from './file.enum';

@Entity('File')
export class File {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn({type: 'int', name: 'tenantId'})
  public tenantId: number;

  @Column('uuid', {name: 'userId'})
  public userId: string;

  @Column('uuid', {name: 'personId'})
  public personId: string;

  @ManyToOne(() => TenantUser, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'userId',
      referencedColumnName: 'userId',
    },
  ])
  public tenantUser: TenantUser;

  @Column('uuid', {name: 'entityId'})
  public entityId: string;

  @Column()
  public filePathAndName: string;

  @Column()
  public fileName: string;

  @Column()
  public entityName: FileEntityName;

  @Column('uuid', {name: 'externalId'})
  public externalId: string;

  @Column('uuid', {name: 'deletedByUserId'})
  public deletedByUserId: string;

  @Column({type: 'varchar'})
  public userName: string;

  @Column({type: 'text'})
  public description: string;

  @ManyToOne(() => TenantUser, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'deletedByUserId',
      referencedColumnName: 'userId',
    },
  ])
  public deletedBy: TenantUser;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<File>) {
    Object.assign(this, data);
  }
}
