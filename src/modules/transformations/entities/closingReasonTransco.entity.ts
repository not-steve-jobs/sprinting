import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('ClosingReasonTransco', {schema: 'transformations'})
export class ClosingReasonTransco {
  @PrimaryColumn({type: 'int'})
  public reasonId: number;

  @PrimaryColumn({type: 'varchar', length: 255})
  public country: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public brand: string;

  @Column({type: 'varchar', length: 255})
  public closedReason: string;

  constructor(data?: Partial<ClosingReasonTransco>) {
    Object.assign(this, data);
  }
}
