import {Injectable} from '@nestjs/common';
import {BranchDto} from './dto/branch.dto';
import {CreateBranchDto} from './dto/createBranch.dto';
import {BranchRepository} from './branch.repository';
import {Branch} from './branch.entity';
import {BranchEnum} from './branch.enum';
import {BranchError} from './branch.error';
import {UpdateBranchDto} from './dto/updateBranch.dto';
import {InfoCreateBranchDto} from './dto/infoCreateBranch.dto';
import {InfoUpdateBranchDto} from './dto/infoUpdateBranch.dto';
import {DataProvidingEventsService} from '../integrations/dataProviding/dataProvidingEvents.service';

@Injectable()
export class BranchService {
  constructor(
    private readonly repository: BranchRepository,
    private readonly dataProvidingEventsService: DataProvidingEventsService,
  ) {}

  public async getAll(tenantId: number): Promise<BranchDto[]> {
    return this.repository.getTenantBranches(tenantId);
  }

  public async findOne(tenantId: number, branchId: string): Promise<Branch> {
    return this.repository.findOneByBranchId(branchId, tenantId);
  }

  public async create(branchToCreate: CreateBranchDto): Promise<BranchDto> {
    return this.createInternal(branchToCreate);
  }

  public async createFromInfo(branchToCreate: InfoCreateBranchDto): Promise<BranchDto> {
    return this.createInternal(branchToCreate);
  }

  private async createInternal(branchToCreate: any): Promise<BranchDto> {
    try {
      const obj = new Branch();
      if (branchToCreate.id) obj.id = branchToCreate.id;
      obj.name = branchToCreate.name;
      obj.tenantId = branchToCreate.tenantId;
      obj.status = branchToCreate.status.toLowerCase() as BranchEnum;
      obj.branchCostCenter = branchToCreate.branchCostCenter;

      const newBranch = await this.repository.save(obj);

      await this.dataProvidingEventsService.sendBranchCreated(newBranch);

      return newBranch;
    } catch (error) {
      throw new BranchError.BranchCreateError(null, error);
    }
  }

  public async updateFromInfo(branchId: string, branchData: InfoUpdateBranchDto): Promise<BranchDto> {
    return this.updateInternal(branchId, branchData);
  }

  public async update(branchId: string, branchData: UpdateBranchDto): Promise<BranchDto> {
    return this.updateInternal(branchId, branchData);
  }

  private async updateInternal(branchId: string, branchData: any): Promise<BranchDto> {
    try {
      const branch = await this.repository.findOneByBranchId(branchId, branchData.tenantId);
      if (branchData.name) branch.name = branchData.name;
      if (branchData.status) branch.status = branchData.status.toLowerCase() as BranchEnum;
      if (branchData.branchCostCenter) branch.branchCostCenter = branchData.branchCostCenter;

      const updatedBranch = await this.repository.save(branch);

      await this.dataProvidingEventsService.sendBranchUpdated(updatedBranch);

      return updatedBranch;
    } catch (error) {
      throw new BranchError.BranchCreateError(null, error);
    }
  }
}
