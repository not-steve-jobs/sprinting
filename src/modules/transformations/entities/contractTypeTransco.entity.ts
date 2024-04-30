import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('ContractTypeTransco', {schema: 'transformations'})
export class ContractTypeTransco {
  @PrimaryColumn({type: 'int'})
  public contractTypeId: number;

  @PrimaryColumn({type: 'varchar', length: 255})
  public country: string;

  @PrimaryColumn({type: 'varchar', length: 255})
  public brand: string;

  @Column({type: 'varchar', length: 255})
  public contractType: string;

  constructor(data?: Partial<ContractTypeTransco>) {
    Object.assign(this, data);
  }
}
