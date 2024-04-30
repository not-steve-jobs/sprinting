import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('ShiftTransco', {schema: 'transformations'})
export class ShiftTransco {
  @PrimaryColumn({type: 'int'})
  public shiftId: number;

  @PrimaryColumn({type: 'varchar', length: 255})
  public country: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public brand: string;

  @Column({type: 'varchar', length: 255})
  public shift: string;

  constructor(data?: Partial<ShiftTransco>) {
    Object.assign(this, data);
  }
}
