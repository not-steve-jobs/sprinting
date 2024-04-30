import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('ServiceTypeRecordTypeTransco', {schema: 'transformations'})
export class ServiceTypeRecordTypeTransco {
  @PrimaryColumn({type: 'int'})
  public serviceTypeId: number;

  @PrimaryColumn({type: 'varchar', length: 255})
  public country: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public brand: string;

  @Column({type: 'varchar', length: 255})
  public recordTypeDeveloperName: string;

  constructor(data?: Partial<ServiceTypeRecordTypeTransco>) {
    Object.assign(this, data);
  }
}
