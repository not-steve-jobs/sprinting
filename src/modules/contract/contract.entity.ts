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
import {Type} from '../type/type.entity';
import {Location} from '../location/location.entity';

@Entity('Contract')
export class Contract {
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

  @Column({type: 'integer'})
  public typeId: number;

  @ManyToOne(() => Type)
  @JoinColumn([
    {
      name: 'typeId',
      referencedColumnName: 'id',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public type: Type;

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
  public dateStart: Date;

  @Index()
  @Column({type: 'timestamp', nullable: true})
  public dateEnd: Date;

  @Index()
  @Column({type: 'timestamp', nullable: true})
  public signatureDate: Date;
  //lux

  @Index()
  @Column({type: 'varchar', length: 255, nullable: true})
  public associateName: string;

  @Index()
  @Column({type: 'varchar', length: 100, nullable: true})
  public service: string;

  //pol

  @Index()
  @Column({type: 'varchar', length: 255, nullable: true})
  public legalEntity: string;

  @Index()
  @Column({type: 'varchar', length: 255, nullable: true})
  public signedBy: string;

  @Index()
  @Column({type: 'varchar', length: 255, nullable: true})
  public serviceType: string;

  @Index()
  @Column({type: 'varchar', length: 255, nullable: true})
  public roleOfThePersonSign: string;

  @Index()
  @Column({type: 'varchar', length: 255, nullable: true})
  public clientsName: string;

  @Index()
  @Column({type: 'varchar', length: 255, nullable: true})
  public VAT: string;

  @Index()
  @Column({type: 'varchar', length: 255, nullable: true})
  public mainPointOfContract: string;

  @Index()
  @Column({type: 'varchar', length: 255, nullable: true})
  public mainPointForInvoice: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Contract>) {
    Object.assign(this, data);
  }
}
