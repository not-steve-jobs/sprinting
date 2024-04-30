import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from 'typeorm';

export enum CaseCategoryType {
  invoices = 1,
  contracts = 2,
  staffingRequests = 3,
  candidatesAssociates = 4,
  generalFeedback = 5,
  companyInformation = 6,
  locationUpdate = 7,
  mainLocationUpdate = 8,
  roleChange = 9,
  newLocation = 10,
  interviewRequest = 11,
  requestCV = 12,
}

@Entity('CaseCategory')
export class CaseCategory {
  @PrimaryColumn({type: 'int'})
  public id: CaseCategoryType;

  @Column({type: 'varchar'})
  public name: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(data?: Partial<CaseCategory>) {
    Object.assign(this, data);
  }
}
