import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('StatusOutOfBusinessTransco', {schema: 'transformations'})
export class StatusOutOfBusinessTransco {
  @PrimaryColumn({type: 'varchar', length: 255})
  public status: string;

  @Column({type: 'boolean'})
  public outOfBusiness: boolean;

  constructor(data?: Partial<StatusOutOfBusinessTransco>) {
    Object.assign(this, data);
  }
}
