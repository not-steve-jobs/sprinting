import {Workplace} from './../workplace/workplace.entity';
import {ClientProfile} from './../clientProfile/clientProfile.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
} from 'typeorm';
import {LocationStatusEnum} from './location.enum';
import {Client} from '../client/client.entity';

@Entity('Location')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'uuid'})
  public clientId: string;

  @ManyToOne(() => Client)
  @JoinColumn([
    {
      name: 'clientId',
      referencedColumnName: 'id',
    },
  ])
  public client: Client;

  @ManyToOne(() => ClientProfile)
  @JoinColumn([
    {
      name: 'clientId',
      referencedColumnName: 'id',
    },
  ])
  public clientProfile: ClientProfile;

  @OneToOne(() => Workplace, (workplace) => workplace.location, {persistence: false, nullable: true})
  workplace: Workplace;

  @Column({type: 'boolean'})
  public isMainLocation: boolean;

  @Index()
  @Column({type: 'varchar', length: 255})
  public locationName: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public street: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public number: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public city: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public state: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public country: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public zip: string;

  @Index()
  @Column({type: 'numeric', nullable: true})
  public lat: number;

  @Index()
  @Column({type: 'numeric', nullable: true})
  public lng: number;

  @Index()
  @Column({type: 'varchar', length: 255})
  public timezone: string;

  @Column({type: 'enum', enum: LocationStatusEnum})
  public status: LocationStatusEnum;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({type: 'varchar', length: 255})
  public externalLocationId: string;

  @Column({type: 'varchar', length: 255})
  public street2: string;

  @Column({type: 'varchar', length: 255})
  public orderOwningOffice: string;

  @Column({type: 'varchar', length: 255})
  public employeeOwningOffice: string;

  @Column({type: 'varchar', length: 255})
  public billToExternalContactId: string;

  constructor(data?: Partial<Location>) {
    Object.assign(this, data);
  }
}
