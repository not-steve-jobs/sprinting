import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('LocationAccountTransco', {schema: 'transformations'})
export class LocationAccountTransco {
  @PrimaryColumn('int')
  public category: number;

  @Column({type: 'varchar', length: 255})
  public description: string;

  @Column({type: 'uuid'})
  public locationId: string;

  @Column({type: 'uuid'})
  public accountConcernedGuid: string;

  constructor(data?: Partial<LocationAccountTransco>) {
    Object.assign(this, data);
  }
}
