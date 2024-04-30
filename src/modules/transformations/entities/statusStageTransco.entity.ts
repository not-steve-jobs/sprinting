import {Entity, PrimaryColumn} from 'typeorm';

@Entity('StatusStageTransco', {schema: 'transformations'})
export class StatusStageTransco {
  @PrimaryColumn({type: 'varchar', length: 50})
  public stage: string;

  @PrimaryColumn({type: 'varchar', length: 50})
  public country: string;

  @PrimaryColumn({type: 'varchar', length: 50})
  public brand: string;

  @PrimaryColumn({type: 'int'})
  public statusId: number;

  constructor(data?: Partial<StatusStageTransco>) {
    Object.assign(this, data);
  }
}
