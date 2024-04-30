import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {ClientProfile} from '../clientProfile/clientProfile.entity';
import {Country} from '../country/country.entity';
import {ClientStatusEnum} from './client.enum';

@Entity('Client')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'text'})
  public name: string;

  @Column({type: 'uuid'})
  public countryId: string;

  @ManyToOne(() => Country, {persistence: false})
  @JoinColumn({
    name: 'countryId',
    referencedColumnName: 'id',
  })
  public country: Country;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({type: 'enum', enum: ClientStatusEnum})
  public status: ClientStatusEnum;

  @OneToOne(() => ClientProfile, (clientProfile) => clientProfile.client, {persistence: false})
  clientProfile: ClientProfile;

  constructor(data?: Partial<Client>) {
    Object.assign(this, data);
  }
}
