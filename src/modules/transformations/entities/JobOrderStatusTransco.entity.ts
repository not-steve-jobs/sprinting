import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('JobOrderStatusTransco', {schema: 'transformations'})
export class JobOrderStatusTransco {
  @PrimaryColumn({type: 'int'})
  public statusId: number;

  @PrimaryColumn({type: 'varchar', length: 255})
  public country: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public brand: string;

  @Column({type: 'varchar', length: 255})
  public status: string;

  constructor(data?: Partial<JobOrderStatusTransco>) {
    Object.assign(this, data);
  }
}
