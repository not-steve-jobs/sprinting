import {PlainObject} from 'src/modules/common/common.dto';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {BusMessage} from './busMessage.entity';

@Entity('BusMessageAttempts')
export class BusMessageAttempts {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid', {name: 'busMessageId'})
  public busMessageId: string;

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

  @ManyToOne(() => BusMessage, {persistence: false})
  @JoinColumn({
    name: 'busMessageId',
    referencedColumnName: 'id',
  })
  public busMessage: BusMessage;

  constructor(data?: Partial<BusMessageAttempts>) {
    Object.assign(this, data);
  }
}
