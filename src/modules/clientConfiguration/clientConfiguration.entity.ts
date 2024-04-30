import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Tenant} from '../tenant/tenant.entity';
import {Client} from '../client/client.entity';
import {Role} from '../role/role.entity';

@Entity('ClientConfiguration')
export class ClientConfiguration {
  @PrimaryGeneratedColumn('uuid') public id: string;

  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn({
    name: 'tenantId',
    referencedColumnName: 'id',
  })
  public tenant: Tenant;

  @PrimaryColumn('uuid') public clientId: string;

  @ManyToOne(() => Client, {persistence: false})
  @JoinColumn([
    {
      name: 'clientId',
      referencedColumnName: 'id',
    },
  ])
  public client: Client;

  @PrimaryColumn({type: 'varchar', length: 255})
  public channel: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public feature: string;

  @PrimaryColumn({type: 'integer'})
  public roleId: number;

  @Column({type: 'jsonb'})
  public config: any;

  @Column({type: 'boolean'})
  public isEnabled: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToOne(() => Role, {persistence: false})
  @JoinColumn([{name: 'roleId', referencedColumnName: 'id'}])
  role: Role;

  constructor(data?: Partial<ClientConfiguration>) {
    Object.assign(this, data);
  }
}
