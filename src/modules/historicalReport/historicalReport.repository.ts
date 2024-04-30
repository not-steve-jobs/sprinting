import {Connection} from 'typeorm';
import {Injectable} from '@nestjs/common';

@Injectable()
export class HistoricalReportRepository {
  constructor(private readonly connection: Connection) {}

  public async get(): Promise<any[]> {
    const query = `
WITH recursive monthsYears("date", "increment") AS
(
  SELECT date_trunc('month', now()), 0
UNION ALL
SELECT "date" - interval '1 month', "increment" + 1
FROM monthsYears
WHERE "increment" < 11
),
uniqueUsers as (
  select "tenantId", "userId", date_trunc('month', min("createdAt")) "date"
from public."UserConsent"
where "isAccepted" = true
group by "tenantId", "userId"
having count("consentId") > 0
),
uniqueUsersGrouped as (
  select uu."tenantId", u."clientId", uu."date", count(uu."userId") "count"
from uniqueUsers uu
left join public."User" u
on uu."userId" = u."id"
group by "tenantId", u."clientId", uu."date"
),
activeUsersGrouped as (
  select tu."tenantId", u."clientId", date_trunc('month', tu."activationDate") "date", count(tu."userId") "count"
from public."TenantUser" tu
left join public."User" u
on tu."userId" = u."id"
where "activationDate" is not null
group by tu."tenantId", u."clientId", "date"
),
staffingRequests as (
  select c."tenantId", u."clientId", date_trunc('month', c."createdAt") "date", count(c.id) "count"
from public."Case" c
inner join public."Status" s
on c."statusId" = s.id and c."tenantId" = s."tenantId"
left join public."User" u
on c."userId" = u."id"
where c."entityName" = 'staffingRequests' and s."name" = 'submitted'
group by c."tenantId", u."clientId", "date"
),
commStaffingOrders as (
  select c."tenantId", u."clientId", date_trunc('month', c."createdAt") "date", count(c.id) "count"
from public."Case" c
inner join public."Status" s
on c."statusId" = s.id and c."tenantId" = s."tenantId"
left join public."User" u
on c."userId" = u."id"
where c."entityName" = 'staffingRequests'
group by c."tenantId", u."clientId", "date"
),
commInvoices as (
  select c."tenantId", u."clientId", date_trunc('month', c."createdAt") "date", count(c.id) "count"
from public."Case" c
inner join public."Status" s
on c."statusId" = s.id and c."tenantId" = s."tenantId"
left join public."User" u
on c."userId" = u."id"
where c."entityName" = 'invoices'
group by c."tenantId", u."clientId", "date"
),
resultSet as (
  select to_char(my."date", 'YYYY-MM-DD') "date",
  COALESCE(uug."tenantId", au."tenantId", sr."tenantId", csr."tenantId", ci."tenantId") "tenantId",
  COALESCE(uug."clientId", au."clientId", sr."clientId", csr."clientId", ci."clientId") "clientId",
  sum(coalesce(uug."count", 0)) "uniqueUsers",
  sum(coalesce(au."count", 0))  "activeUsers",
  sum(coalesce(sr."count", 0)) "staffingRequests",
  sum(coalesce(csr."count", 0)) "commStaffingOrders",
  sum(coalesce(ci."count", 0)) "commInvoices"
from monthsYears my
left join uniqueUsersGrouped uug
on my."date" = uug."date"
left join activeUsersGrouped au
on my."date" = au."date"
and au."tenantId" = uug."tenantId" and au."clientId" = uug."clientId"
left join staffingRequests sr
on my."date" = sr."date"
and au."tenantId" = sr."tenantId" and au."clientId" = sr."clientId"
left join commStaffingOrders csr
on my."date" = csr."date"
and au."tenantId" = csr."tenantId" and au."clientId" = csr."clientId"
left join commInvoices ci
on my."date" = ci."date"
and au."tenantId" = ci."tenantId" and au."clientId" = ci."clientId"
group by
COALESCE(uug."tenantId", au."tenantId", sr."tenantId", csr."tenantId", ci."tenantId"),
COALESCE(uug."clientId", au."clientId", sr."clientId", csr."clientId", ci."clientId"),
my."date"
order by my."date" desc
)
select "date", c."code", cl."name", t."name", rs."uniqueUsers", rs."activeUsers",
  rs."staffingRequests", rs."commStaffingOrders", rs."commInvoices"
from resultSet rs
left join public."Tenant" t
on t.id = rs."tenantId"
left join public."Country" c
on c.id = t."countryId"
left join public."Client" cl
on rs."clientId" = cl.id`;
    return this.connection.query(query);
  }

  public async getCommunicationCases(): Promise<any[]> {
    const query = `
    WITH CaseComments as (
      select c.id "CaseID", count(*) as "Comments" from "Case" c 
      inner join "CaseComment" cc 
      on c.id = cc."caseId" 
      group by c.id
      )
      select to_char(cast(date_trunc('month', c."createdAt") as date), 'YYYY-MM-DD') "Date", c2.code as "CountryCode",c3."name" as "Clients" ,t.brand as "Brand", cc."name" as "CaseCategory", count(case s."name" when 'closed' then 1 else null end)"NumberOfClosedCases", count(case s."name" when 'open' then 1 else null end)"NumberOfCreatedCases", sum(coalesce(cc2."Comments", 0)) "AverageNumberOfMessages" from "Case" c 
      left join "CaseCategory" cc 
      on c."caseCategoryId" = cc.id 
      left join "Status" s 
      on c."statusId" =s.id
      left join "Tenant" t 
      on c."tenantId" =t.id
      left join "Country" c2 
      on t."countryId" =c2.id 
      left join "User" u 
      on c."userId" = u.id 
      left join "Client" c3 
      on u."clientId" = c3.id 
      left join CaseComments cc2 
      on c.id = cc2."CaseID" 
      group by "Date",c2.code,c3.name,t.brand,cc."name"`;
    return this.connection.query(query);
  }

  public async getNpsReport(): Promise<any[]> {
    const query = `
select ct.code as "country", t.brand as "brand", cl."name" as "client", nps."createdAt", nps.rate as "score", nps."comment"
from public."NetPromoteScore" nps
    inner join public."Tenant" t
        on nps."tenantId" = t.id
    inner join public."Country" ct
        on ct.id = t."countryId"
    inner join public."User" u
        on nps."userId" = u.id
    inner join public."Client" cl
        on u."clientId" = cl.id
order by "createdAt"`;
    return this.connection.query(query);
  }
}
