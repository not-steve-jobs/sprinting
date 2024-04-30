import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import {Country} from '../country/country.entity';
import {CustomAppProperties, DestinationSystem} from './tenant.enum';

@Entity('Tenant')
export class Tenant {
  @PrimaryColumn({type: 'int'})
  public id: number;

  @Column({type: 'varchar'})
  public domain: string;

  @Column({type: 'varchar', length: 255})
  public name: string;

  @Column({type: 'varchar', length: 255})
  public alias: string;

  @Column({type: 'uuid'})
  public countryId: string;

  @ManyToOne(() => Country, {persistence: false})
  @JoinColumn({
    name: 'countryId',
    referencedColumnName: 'id',
  })
  public country: Country;

  @Column({type: 'varchar', length: 255, nullable: true})
  public website: string;

  // TODO: Review why locale is here, the feeling is that they come from user-preferences
  @Column({type: 'varchar', length: 255, nullable: true})
  public locale: string;

  @Column({type: 'varchar', length: 255})
  public brand: string;

  @Column({type: 'jsonb'})
  public appConfig: object;

  @Column({type: 'varchar', length: 255})
  public destinationSystem: DestinationSystem;

  @Column({type: 'jsonb'})
  public customAppProperties: CustomAppProperties[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Tenant>) {
    Object.assign(this, data);
  }
}
