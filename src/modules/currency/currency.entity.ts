import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('Currency')
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'varchar', length: 10})
  public code: string;

  @Column({type: 'varchar', length: 255})
  public name: string;

  @Column({type: 'varchar', length: 10})
  public symbol: string;

  @Column('boolean')
  public space: boolean;

  @Column('boolean')
  public suffix: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Currency>) {
    Object.assign(this, data);
  }
}
