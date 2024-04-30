import { INestApplication } from "@nestjs/common";
import { Logger } from 'src/core/logger';
import { AvailableWorkersRepository } from "src/modules/availableWorkers/availableWorkers.repository";
import { FixInterface } from "src/modules/fix/fix.interface";
import { adeccoSwi } from '../src/seed/tenantSpecific/data/tenant.data';

export class RemoveAvailableWorkersAdeccoSwi1647415377000 implements FixInterface {
  public async execute(applicationInstance: INestApplication, logger: Logger): Promise<any> {
    logger.info(__filename, 'Apply fix for removing available workers records for tenant 137.');
    const availableWorkersRepository = applicationInstance.get(AvailableWorkersRepository);

    const availableWorkers = await availableWorkersRepository.findAll(adeccoSwi.id);

    await availableWorkersRepository.deleteMany(availableWorkers);
    logger.info(__filename, `Done. Fix applied on AvailableWorkers.`);
  }
}
