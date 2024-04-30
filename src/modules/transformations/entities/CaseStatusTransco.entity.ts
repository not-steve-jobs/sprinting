import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('CaseStatusTransco', {schema: 'transformations'})
export class CaseStatusTransco {
  @PrimaryColumn({type: 'varchar', length: 50})
  public status: string;

  @PrimaryColumn({type: 'int'})
  public statusId: number;

  @PrimaryColumn({type: 'varchar', length: 50})
  public country: string;

  @PrimaryColumn({type: 'varchar', length: 50})
  public brand: string;

  @PrimaryColumn({type: 'int'})
  public tenantId: number;

  @Column({type: 'varchar', length: 255})
  public description: string;

  constructor(data?: Partial<CaseStatusTransco>) {
    Object.assign(this, data);
  }
}
