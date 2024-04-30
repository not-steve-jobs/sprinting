import {PlainObject} from 'src/modules/common/common.dto';
import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('BusMessage')
export class BusMessage {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public scope: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public direction: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public messageName: string;

  @Index()
  @Column('uuid')
  public messageId: string;

  @Index()
  @Column({type: 'varchar', length: 20})
  public type: string;

  @Column({type: 'jsonb'})
  public payload: PlainObject;

  @Index()
  @Column({type: 'varchar', length: 20})
  public status?: string;

  @Column({type: 'jsonb'})
  public response?: PlainObject;

  @Column({type: 'text', nullable: true})
  public internalError: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column({type: 'text', nullable: true})
  public fixedBy: string;

  constructor(data?: Partial<BusMessage>) {
    Object.assign(this, data);
  }
}
