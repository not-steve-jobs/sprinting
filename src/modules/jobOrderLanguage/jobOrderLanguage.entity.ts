import {JobOrder} from '../jobOrder/jobOrder.entity';
import {Language} from '../language/language.entity';
import {Level} from '../level/level.entity';
import {Entity, JoinColumn, PrimaryColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Column} from 'typeorm';

@Entity('JobOrderLanguage', {schema: 'public'})
export class JobOrderLanguage {
  @PrimaryColumn('uuid')
  public jobOrderId: string;

  @PrimaryColumn('int')
  public tenantId: number;

  @ManyToOne(() => JobOrder, {persistence: false})
  @JoinColumn([
    {
      name: 'jobOrderId',
      referencedColumnName: 'id',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public jobOrder: JobOrder;

  @PrimaryColumn('uuid')
  public languageId: string;

  @ManyToOne(() => Language, {persistence: false})
  @JoinColumn({
    name: 'languageId',
    referencedColumnName: 'id',
  })
  public language: Language;

  @Column('int')
  public levelId?: number;

  @ManyToOne(() => Level, {persistence: false})
  @JoinColumn({
    name: 'levelId',
    referencedColumnName: 'id',
  })
  public level: Level;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<JobOrderLanguage>) {
    Object.assign(this, data);
  }
}
