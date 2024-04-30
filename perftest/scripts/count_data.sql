CREATE OR REPLACE FUNCTION count_number_of_rows() RETURNS void AS
$$
DECLARE
  client_count int;
  job_order_count int;
  notification_count int;
  case_count int;
  case_category_count int;
  case_comment_count int;
  case_follower_count int;
  contract_count int;
  invoice_count int;

BEGIN
  select count(*) from "Client"
  where name ='K6ClientName'
  into client_count;

  select count(*) from "JobOrder"
  where name='K6JobOrderName'
  into job_order_count;

  select count(*) from "Notification"
  where "entityName"='K6entityName'
  into notification_count;

  select count(*) from "Case"
  into case_count;

  select count(*) from "CaseCategory"
  into case_category_count;

  select count(*) from "CaseComment"
  into case_comment_count;

  select count(*) from "CaseFollower"
  into case_follower_count;

  select count(*) from "Contract"
  where number like 'K6StatusNumber%'
  into contract_count;

  select count(*) from "Invoice"
  where "creditNotes" like 'K6Test%'
  into invoice_count;

  raise notice 'client_count: %', client_count;
  raise notice 'job_order_count: %', job_order_count;
  raise notice 'notification_count: %', notification_count;
  raise notice 'case_count: %', case_count;
  raise notice 'case_category_count: %', case_category_count;
  raise notice 'case_comment_count: %', case_comment_count;
  raise notice 'case_follower_count: %', case_follower_count;
  raise notice 'contract_count: %', contract_count;
  raise notice 'invoice_count: %', invoice_count;
END
$$ LANGUAGE plpgsql;


SELECT count_number_of_rows();
