import {Injectable} from '@nestjs/common';
import {AuthRolesEnum} from 'src/core/auth/authRoles';
import {AbstractRepository, EntityRepository, SelectQueryBuilder} from 'typeorm';
import {ClientConfiguration} from './clientConfiguration.entity';
import {ClientConfigurationMainMenuConfigDto} from './dto/clientConfigurationMenuConfig.dto';

@Injectable()
@EntityRepository(ClientConfiguration)
export class ClientConfigurationRepository extends AbstractRepository<ClientConfiguration> {
  private q(tenantId: number): SelectQueryBuilder<ClientConfiguration> {
    return this.createQueryBuilder('ClientConfiguration').where('"tenantId" = :tenantId', {tenantId});
  }

  public async findAll(tenantId: number): Promise<ClientConfiguration[]> {
    return this.q(tenantId).getMany();
  }

  public async findAllByRole(tenantId: number, roleId: number): Promise<ClientConfiguration[]> {
    return this.manager.find<ClientConfiguration>(ClientConfiguration, {
      where: {
        tenantId,
        roleId,
      },
    });
  }

  public async findOne(
    tenantId: number,
    feature: string,
    channel: string,
    roleId: number,
    clientId: string,
  ): Promise<ClientConfiguration> {
    return this.q(tenantId)
      .andWhere('"channel" = :channel', {channel})
      .andWhere('"feature" = :feature', {feature})
      .andWhere('"roleId" = :roleId', {roleId})
      .andWhere('"clientId" = :clientId', {clientId})
      .getOne();
  }

  public async getMainMenu(
    tenantId: number,
    clientId: string,
    userRoleId: number,
  ): Promise<{menuConfig: ClientConfigurationMainMenuConfigDto}> {
    const confs = await this.manager.query(
      `select coalesce(fc.config || cc.config || cc2.config, fc.config || cc.config, fc.config) as "menuConfig"
      from "FeatureConfiguration" fc
      left join "ClientConfiguration" cc on cc.feature = fc.feature and cc."tenantId" = fc."tenantId" and cc."roleId" = $4 and cc."clientId" = $2
      left join "ClientConfiguration" cc2 on cc2.feature = fc.feature and cc2."tenantId" = fc."tenantId" and cc2."roleId" = $3 and cc2."clientId" = $2
      where fc.feature = 'mainMenu' and fc."tenantId" = $1`,
      [tenantId, clientId, userRoleId, AuthRolesEnum.Common],
    );
    return confs[0];
  }

  public async save(entity: ClientConfiguration): Promise<ClientConfiguration> {
    return this.manager.save(entity);
  }

  public async saveBulk(list: ClientConfiguration[]): Promise<ClientConfiguration[]> {
    return this.manager.save(list);
  }

  public async delete(entity: ClientConfiguration) {
    return this.manager.remove(entity);
  }
}
