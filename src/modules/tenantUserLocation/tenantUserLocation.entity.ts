import {Location} from '../location/location.entity';
import {CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {TenantUser} from '../tenantUser/tenantUser.entity';

@Entity('TenantUserLocation')
export class TenantUserLocation {
  @PrimaryColumn('uuid')
  public userId: string;

  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => TenantUser, {persistence: false})
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'userId',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public tenantUser: TenantUser;

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

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<TenantUserLocation>) {
    Object.assign(this, data);
  }
}
