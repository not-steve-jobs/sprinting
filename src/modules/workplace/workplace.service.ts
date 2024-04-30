import {WorkplaceError} from './workplace.error';
import {WorkplaceCreateDto} from './dto/workplaceCreate.dto';
import {Workplace} from './workplace.entity';
import {Injectable} from '@nestjs/common';
import {WorkplaceRepository} from './workplace.repository';

@Injectable()
export class WorkplaceService {
  constructor(private readonly workplaceRepository: WorkplaceRepository) {}

  public async getAll(parentLocationId: string): Promise<Workplace[]> {
    return this.workplaceRepository.getAll(parentLocationId);
  }

  public async save(workplaceData: WorkplaceCreateDto): Promise<Workplace> {
    try {
      const workplace = new Workplace(workplaceData);
      return await this.workplaceRepository.save(workplace);
    } catch (error) {
      throw new WorkplaceError.WorkplaceCreateError(null, error);
    }
  }
}
