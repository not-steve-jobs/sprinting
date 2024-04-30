import {CreateDateColumn, Entity, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn} from 'typeorm';
import {Region} from '../region/region.entity';

@Entity('RegionPostalCode', {schema: 'public'})
export class RegionPostalCode {
  @PrimaryColumn('uuid')
  public regionId: string;

  @ManyToOne(() => Region)
  @JoinColumn([
    {
      name: 'regionId',
      referencedColumnName: 'id',
    },
  ])
  public region: Region;

  @PrimaryColumn({type: 'text'})
  public zip: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<RegionPostalCode>) {
    Object.assign(this, data);
  }
}
