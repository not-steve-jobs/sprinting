import {WorkplaceStatus} from './workplace.enum';
import {Location} from 'src/modules/location/location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

@Entity('Workplace', {schema: 'public'})
export class Workplace {
  @PrimaryColumn({type: 'uuid'})
  public locationId: string;

  @OneToOne(() => Location)
  @JoinColumn([
    {
      name: 'locationId',
      referencedColumnName: 'id',
    },
  ])
  public location: Location;

  @Column({type: 'uuid'})
  public parentLocationId: string;

  @ManyToOne(() => Location)
  @JoinColumn([
    {
      name: 'parentLocationId',
      referencedColumnName: 'id',
    },
  ])
  public parentLocation: Location;

  @Column({type: 'varchar', length: 255})
  public workEnvironment: string;

  @Column({type: 'enum', enum: WorkplaceStatus})
  public status: WorkplaceStatus;

  @Column({type: 'varchar', length: 255})
  public wifiId: string;

  @Column({type: 'varchar', length: 255})
  public qrCode: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Workplace>) {
    Object.assign(this, data);
  }
}
