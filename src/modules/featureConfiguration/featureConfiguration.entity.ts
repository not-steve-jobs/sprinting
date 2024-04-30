import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {Tenant} from '../tenant/tenant.entity';
import {FeatureConfigurationChannel} from './enum/featureConfigurationChannel.enum';
import {FeatureConfigurationFeature} from './enum/featureConfigurationFeature.enum';

@Entity('FeatureConfiguration')
export class FeatureConfiguration<T = any> {
  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn({
    name: 'tenantId',
    referencedColumnName: 'id',
  })
  public tenant: Tenant;

  @Column('uuid')
  public id: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public channel: FeatureConfigurationChannel;

  @PrimaryColumn({type: 'varchar', length: 255})
  public feature: FeatureConfigurationFeature;

  @Column({type: 'jsonb'})
  public config: T;

  @Column({type: 'boolean'})
  public isEnabled: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<FeatureConfiguration>) {
    Object.assign(this, data);
  }
}
