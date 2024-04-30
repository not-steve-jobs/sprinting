import {Injectable} from '@nestjs/common';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {Client} from './client.entity';

@Injectable()
@EntityRepository(Client)
export class ClientRepository extends AbstractRepository<Client> {
  private q(): SelectQueryBuilder<Client> {
    return this.createQueryBuilder('Client');
  }

  public async findOne(id: string): Promise<Client> {
    return this.q().andWhere('"id" = :id', {id}).getOne();
  }

  public async findOneByExternalCustomerId(externalCustomerId: string): Promise<Client> {
    return this.q()
      .select(['Client'])
      .leftJoin('Client.clientProfile', 'ClientProfile')
      .andWhere('"ClientProfile"."externalCustomerId" = :externalCustomerId', {externalCustomerId})
      .getOne();
  }

  public async save(entity: Client) {
    return this.manager.save(entity);
  }
}
