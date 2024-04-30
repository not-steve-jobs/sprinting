import {CaseCategoryTransco} from 'src/modules/transformations/entities/CaseCategoryTransco.entity';
import {CaseCategoryTranscoData, TranscoTableData} from 'src/modules/transformations/enums/transformations.types';

export const caseCategoryTranscoData: CaseCategoryTranscoData[] = [
  {category: 1, caseReason: 'Invoices', comment: 'invoices'},
  {category: 2, caseReason: 'Contracts', comment: 'contracts'},
  {category: 3, caseReason: 'Staffing request', comment: 'staffingRequests'},
  {category: 4, caseReason: 'Associate/Candidate', comment: 'candidatesAssociates'},
  {category: 5, caseReason: 'General/Feedback', comment: 'generalFeedback'},
  {category: 6, caseReason: 'Account Update', comment: 'companyInformation'},
  {category: 7, caseReason: 'Account Update', comment: 'locationUpdate'},
  {category: 8, caseReason: 'Contact Update - Direct Account update', comment: 'mainLocationUpdate'},
  {category: 9, caseReason: 'Contact Update - Portal role update', comment: 'roleChange'},
  {category: 10, caseReason: 'Account Creation', comment: 'newLocation'},
  {category: 11, caseReason: 'Request for Candidate interview', comment: 'interviewRequest'},
  {category: 12, caseReason: 'Request for Candidate CV', comment: 'requestCV'},
];

export const caseCategoryTranscoKeys = ['category'];

export const caseCategoryTranscoTableData: TranscoTableData = {
  entity: CaseCategoryTransco,
  data: caseCategoryTranscoData,
  primaryKeys: caseCategoryTranscoKeys,
};
