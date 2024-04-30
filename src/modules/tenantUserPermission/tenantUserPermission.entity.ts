import {Permission} from '../permission/permission.entity';
import {CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {TenantUser} from '../tenantUser/tenantUser.entity';

@Entity('TenantUserPermission')
export class TenantUserPermission {
  @PrimaryColumn({type: 'integer'})
  public tenantId: number;

  @PrimaryColumn({type: 'uuid', name: 'userId'})
  public userId: string;

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
  public permissionId: string;

  @ManyToOne(() => Permission, {persistence: false})
  @JoinColumn([
    {
      name: 'permissionId',
      referencedColumnName: 'id',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public permission: Permission;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<TenantUserPermission>) {
    Object.assign(this, data);
  }
}
