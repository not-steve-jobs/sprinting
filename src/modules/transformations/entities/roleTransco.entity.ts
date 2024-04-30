import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('RoleTransco', {schema: 'transformations'})
export class RoleTransco {
  @PrimaryColumn({type: 'int'})
  public roleId: number;

  @Column({type: 'varchar', length: 255})
  public role: string;

  constructor(data?: Partial<RoleTransco>) {
    Object.assign(this, data);
  }
}
