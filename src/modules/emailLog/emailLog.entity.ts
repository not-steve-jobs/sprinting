import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

import {PlainObject} from 'src/modules/common/common.dto';
import {EmailLogStatus} from 'src/modules/status/status.enum';

@Entity('EmailLog')
export class EmailLog {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({type: 'varchar', length: 32})
  public messageKey: string;

  @Column({type: 'jsonb', nullable: true})
  public request: PlainObject;

  @Column({type: 'jsonb', nullable: true})
  public response: PlainObject;

  @Column({type: 'varchar', length: 64})
  public status: EmailLogStatus;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<EmailLog>) {
    Object.assign(this, data);
  }
}
