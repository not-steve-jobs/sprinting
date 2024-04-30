import {Entity, PrimaryColumn, Column} from 'typeorm';

@Entity('CaseCategoryTransco', {schema: 'transformations'})
export class CaseCategoryTransco {
  @PrimaryColumn({type: 'int'})
  public category: number;

  @PrimaryColumn({type: 'varchar', length: 255})
  public caseReason: string;

  @Column({type: 'varchar', length: 255})
  public comment: string;

  constructor(data?: Partial<CaseCategoryTransco>) {
    Object.assign(this, data);
  }
}
