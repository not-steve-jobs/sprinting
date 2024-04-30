import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {Tenant} from '../tenant/tenant.entity';
import {Status} from '../status/status.entity';
import {Location} from '../location/location.entity';

@Entity('Invoice')
export class Invoice {
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

  @Column({type: 'integer'})
  public statusId: number;

  @ManyToOne(() => Status)
  @JoinColumn([
    {
      name: 'statusId',
      referencedColumnName: 'id',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public status: Status;

  @Index()
  @Column({type: 'varchar', length: 255, nullable: true})
  public number: string;

  @Column({type: 'uuid'})
  public locationId: string;

  @ManyToOne(() => Location)
  @JoinColumn({
    name: 'locationId',
    referencedColumnName: 'id',
  })
  public location: Location;

  @Index()
  @Column({type: 'timestamp', nullable: true})
  public issueDate: Date;

  @Index()
  @Column({type: 'int', nullable: true})
  public totalAmount: number;

  @Index()
  @Column({type: 'int', nullable: true})
  public hoursBilled: number;

  @Index()
  @Column({type: 'timestamp', nullable: true})
  public duePaymentDate: Date;

  @Index()
  @Column({type: 'varchar', length: 100, nullable: true})
  public attachments: string;

  //lux
  @Index()
  @Column({type: 'timestamp', nullable: true})
  public periodStart: Date;

  @Index()
  @Column({type: 'timestamp', nullable: true})
  public periodEnd: Date;

  @Index()
  @Column({type: 'varchar', length: 100, nullable: true})
  public creditNotes: string;

  //pol
  @Index()
  @Column({type: 'varchar', length: 30, nullable: true})
  public currency: string;

  @Index()
  @Column({type: 'int', nullable: true})
  public amountBeforeTax: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Invoice>) {
    Object.assign(this, data);
  }
}
