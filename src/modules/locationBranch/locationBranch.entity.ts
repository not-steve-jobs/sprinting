import {Branch} from '../branch/branch.entity';
import {Tenant} from './../tenant/tenant.entity';
import {Location} from '../location/location.entity';
import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';

@Entity('LocationBranch')
export class LocationBranch {
  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'id',
    },
  ])
  public tenant: Tenant;

  @PrimaryColumn('uuid')
  public locationId: string;

  @ManyToOne(() => Location, {persistence: false})
  @JoinColumn([
    {
      name: 'locationId',
      referencedColumnName: 'id',
    },
  ])
  public location: Location;

  @PrimaryColumn('uuid')
  public branchId: string;

  @ManyToOne(() => Branch, {persistence: false})
  @JoinColumn([
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
    {
      name: 'branchId',
      referencedColumnName: 'id',
    },
  ])
  public branch: Branch;

  @Column({default: false})
  public inTerritory: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<LocationBranch>) {
    Object.assign(this, data);
  }
}
