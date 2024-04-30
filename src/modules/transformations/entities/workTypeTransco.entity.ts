import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('WorkTypeTransco', {schema: 'transformations'})
export class WorkTypeTransco {
  @PrimaryColumn({type: 'int'})
  public workTypeId: number;

  @PrimaryColumn({type: 'varchar', length: 255})
  public country: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public brand: string;

  @Column({type: 'varchar', length: 255})
  public workType: string;

  constructor(data?: Partial<WorkTypeTransco>) {
    Object.assign(this, data);
  }
}
