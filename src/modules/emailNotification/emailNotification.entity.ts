import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index} from 'typeorm';

import {PlainObject} from 'src/modules/common/common.dto';
import {EmailNotificationStatus} from 'src/modules/status/status.enum';

@Entity('EmailNotification')
export class EmailNotification {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public type: string;

  @Index()
  @Column({type: 'varchar', length: 255})
  public email: string;

  @Column({type: 'jsonb', nullable: true})
  public payload: PlainObject;

  @Column({type: 'timestamp', nullable: true})
  public sendDate: Date;

  @Column({type: 'varchar', length: 64})
  public status: EmailNotificationStatus;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<EmailNotification>) {
    Object.assign(this, data);
  }
}
