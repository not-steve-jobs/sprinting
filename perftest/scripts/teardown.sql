CREATE OR REPLACE FUNCTION clear_job_orders_data(tenant_id int) RETURNS void AS
$$
BEGIN
  RAISE NOTICE 'clear_job_orders_data started';

  DELETE FROM "JobOrder"
  WHERE "JobOrder"."tenantId" = tenant_id
    AND "JobOrder".name = 'Temporary'
    AND "JobOrder"."jobDescription" = 'test description k6';

  DELETE FROM "Case"
  WHERE "Case"."tenantId" = tenant_id
    AND "Case"."description" = 'k6_dynamic_value';

END
$$ LANGUAGE plpgsql;



select clear_job_orders_data(137);
