import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Tenant} from '../tenant/tenant.entity';
import {ConsentType} from './consentType.enum';

@Entity('Consent', {schema: 'public'})
export class Consent {
  @PrimaryColumn('uuid')
  public id: string;

  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn({
    name: 'tenantId',
    referencedColumnName: 'id',
  })
  public tenant: Tenant;

  @Column({type: 'varchar'})
  public url: string;

  @Column({type: 'varchar'})
  public type: ConsentType;

  @Column({type: 'int'})
  public version: number;

  @Column({type: 'date'})
  public validFrom: Date;

  @Column('boolean')
  public isMandatory: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Consent>) {
    Object.assign(this, data);
  }
}
