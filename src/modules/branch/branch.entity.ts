import {BranchEnum} from './branch.enum';
import {Tenant} from './../tenant/tenant.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
} from 'typeorm';

@Entity('Branch', {schema: 'public'})
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => Tenant, {persistence: false})
  @JoinColumn({
    name: 'tenantId',
    referencedColumnName: 'id',
  })
  public tenant: Tenant;

  @Column({type: 'enum', enum: BranchEnum})
  public status: BranchEnum;

  @Column({type: 'text'})
  public name: string;

  @Column({type: 'text'})
  public branchCostCenter: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Branch>) {
    Object.assign(this, data);
  }
}
