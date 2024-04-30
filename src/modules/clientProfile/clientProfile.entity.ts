import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
} from 'typeorm';
import {Location} from '../location/location.entity';
import {Client} from '../client/client.entity';
import {Country} from '../country/country.entity';

@Entity('ClientProfile')
@Unique(['businessName', 'email'])
export class ClientProfile {
  @PrimaryColumn('uuid')
  public id: string;

  @OneToOne(() => Client)
  @JoinColumn([
    {
      name: 'id',
      referencedColumnName: 'id',
    },
  ])
  public client: Client;

  @OneToMany(() => Location, (location) => location.clientProfile, {persistence: false})
  @JoinColumn([{name: 'id', referencedColumnName: 'id'}])
  public locations: Location[];

  @Column({type: 'varchar', length: 255})
  public businessName: string;

  @Column({type: 'varchar', length: 50})
  public number: string;

  @Column({type: 'varchar', length: 255})
  public email: string;

  @Column({type: 'varchar', length: 50})
  public phone: string;

  @Column({type: 'varchar', length: 255})
  public phonePrefix: string;

  @Column({type: 'varchar', length: 255})
  public web: string;

  @Column({type: 'int'})
  public VAT: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({type: 'varchar', length: 255})
  public externalCustomerId: string;

  @Column({type: 'varchar', length: 255})
  public street: string;

  @Column({type: 'varchar', length: 255})
  public street2: string;

  @Column({type: 'varchar', length: 255})
  public city: string;

  @Column({type: 'varchar', length: 2})
  public state: string;

  @Column({type: 'varchar', length: 10})
  public zip: string;

  @Column({type: 'uuid'})
  public countryId: string;

  @ManyToOne(() => Country, {persistence: false})
  @JoinColumn({
    name: 'countryId',
    referencedColumnName: 'id',
  })
  public country: Country;

  @Column({type: 'varchar', length: 255})
  public nationalAccountManager: string;

  @Column({type: 'varchar', length: 255})
  public branchCostCenter: string;

  @Column({type: 'varchar', length: 32})
  public customerType: string;

  @Column({type: 'boolean'})
  public contractRequired: boolean;

  constructor(data?: Partial<ClientProfile>) {
    Object.assign(this, data);
  }
}
