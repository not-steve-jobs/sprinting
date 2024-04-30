import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('JobRoleTransco', {schema: 'transformations'})
export class JobRoleTransco {
  @PrimaryColumn({type: 'uuid'})
  public jobRoleId: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public country: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public brand: string;

  @Column({type: 'varchar', length: 255})
  public jobRole: string;

  constructor(data?: Partial<JobRoleTransco>) {
    Object.assign(this, data);
  }
}
