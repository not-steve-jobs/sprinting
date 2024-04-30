import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('Country')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'varchar', length: 10})
  public code: string;

  @Column({type: 'varchar', length: 255})
  public name: string;

  @Column({type: 'varchar', length: 10})
  public callingCode: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<Country>) {
    Object.assign(this, data);
  }
}
