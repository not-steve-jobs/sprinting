import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('RatePeriodTransco', {schema: 'transformations'})
export class RatePeriodTransco {
  @PrimaryColumn({type: 'int'})
  public rateId: number;

  @PrimaryColumn({type: 'varchar', length: 255})
  public country: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public brand: string;

  @Column({type: 'varchar', length: 255})
  public payRatePeriod: string;

  constructor(data?: Partial<RatePeriodTransco>) {
    Object.assign(this, data);
  }
}
