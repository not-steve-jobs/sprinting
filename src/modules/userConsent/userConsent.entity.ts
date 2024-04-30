import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from 'typeorm';
import {User} from '../user/user.entity';
import {Consent} from '../consent/consent.entity';

@Entity('UserConsent')
export class UserConsent {
  @PrimaryColumn('uuid')
  public userId: string;

  @ManyToOne(() => User, {persistence: false})
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  public user: User;

  @PrimaryColumn('int')
  public tenantId: number;

  @PrimaryColumn('uuid')
  public consentId: string;

  @ManyToOne(() => Consent, {persistence: false})
  @JoinColumn([
    {
      name: 'consentId',
      referencedColumnName: 'id',
    },
    {
      name: 'tenantId',
      referencedColumnName: 'tenantId',
    },
  ])
  public consent: Consent;

  @Column('boolean')
  public isAccepted: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<UserConsent>) {
    Object.assign(this, data);
  }
}
