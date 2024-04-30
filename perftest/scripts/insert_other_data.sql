--
CREATE OR REPLACE FUNCTION insert_other_data(row_count int, tenant_id int) RETURNS void AS
$$
DECLARE
  case_category_id int;
  type_id int;
  location_id uuid;
  status_id int;
  client_id uuid;
  user_id uuid;
  service_type_id int;
  job_role_id uuid;
  level_id int;
  shift_id int;
  employment_type_id int;
  rate_id int;
  branch_id uuid;
  contract_type_id int;
  sector_id uuid;

BEGIN
  FOR counter IN 1..row_count
    LOOP
      SELECT MAX(id) + 1 FROM "CaseCategory" INTO case_category_id;
      SELECT MAX(id) + 1 FROM "Type" INTO type_id;
      SELECT MAX(id) + 1 FROM "ServiceType" INTO service_type_id;
      SELECT MAX(id) + 1 FROM "Level" INTO level_id;
      SELECT MAX(id) + 1 FROM "Shift" INTO shift_id;
      SELECT MAX(id) + 1 FROM "EmploymentType" INTO employment_type_id;
      SELECT MAX(id) + 1 FROM "Rate" INTO rate_id;

      SELECT id FROM "Location"
      WHERE "locationName" = 'locationName'
      ORDER BY random()
      LIMIT 1
      INTO location_id;

      SELECT id FROM "Status"
      WHERE "name" = 'K6StatusName'
      ORDER BY random()
      LIMIT 1
      INTO status_id;

      SELECT id FROM "Client"
      WHERE "name" = 'K6ClientName'
      ORDER BY id
      LIMIT 1 OFFSET counter
      INTO client_id;

      SELECT id FROM "User"
      WHERE "User".email LIKE 'testk6%'
      ORDER BY random()
      LIMIT 1
      INTO user_id;

      INSERT INTO "CaseCategory" (id, name)
      VALUES (case_category_id, 'K6CaseCategoryName');

      INSERT INTO "Type"(id, "tenantId", "entityName", "name")
      VALUES (type_id, tenant_id, uuid_generate_v4()::VARCHAR(10), 'K6TypeName')
      RETURNING id INTO contract_type_id;

      INSERT INTO "Contract"("tenantId", "locationId", "statusId", number)
      VALUES (tenant_id, location_id, status_id, concat('K6StatusNumber', uuid_generate_v4()::VARCHAR(10)));

      INSERT INTO "Invoice"("tenantId", number, "locationId", "totalAmount", "hoursBilled", "statusId", "creditNotes", "amountBeforeTax")
      VALUES (tenant_id, uuid_generate_v4()::VARCHAR(15), location_id, 10, 10, status_id, 'K6Test',10);

      INSERT INTO "JobRole"("tenantId", name, "infoSkillCode", "keyName", "rcCategoryId", "isPesSubject")
      VALUES (tenant_id, 'K6TestRole', 'infoSkillCode', 'keyName', 'rcCategoryId', false)
      RETURNING id into job_role_id;

      INSERT INTO "Notification"("tenantId", "userId", "entityId", "type", "isRead", "entityName")
      VALUES (tenant_id, user_id, uuid_generate_v4(), 'type', true, 'K6entityName');

      INSERT INTO "ServiceType"(id, "tenantId", "name")
      VALUES (service_type_id, tenant_id, 'K6ServiceTypeName');

      INSERT INTO "Level"(id, "entityName", "name")
      VALUES (level_id, 'entityName', CONCAT('K6LevelName', uuid_generate_v4()::VARCHAR(10)));

      INSERT INTO "Branch"("tenantId", status, name)
      VALUES (tenant_id, 'open', 'K6BranchName')
      RETURNING id INTO branch_id;

      INSERT INTO "Shift"(id, "tenantId", name)
      VALUES (shift_id, tenant_id, 'K6ShiftName');

      INSERT INTO "Sector"("tenantId", name)
      VALUES (tenant_id, 'K6SectorName')
      RETURNING id INTO sector_id;

      INSERT INTO "EmploymentType"(id, "tenantId", name)
      VALUES (employment_type_id, tenant_id, 'Full time k6');

      INSERT INTO "Rate"(id, "tenantId", name, "keyName")
      VALUES (rate_id, tenant_id, 'Daily', 'k6Test');

    END LOOP;
END
$$ LANGUAGE plpgsql;


--
CREATE OR REPLACE FUNCTION insert_job_order_data(row_count int, tenant_id int) RETURNS void AS
$$
DECLARE
  location_id uuid;
  status_id int;
  client_id uuid;
  user_id uuid;
  service_type_id int;
  job_role_id uuid;
  level_id int;
  shift_id int;
  employment_type_id int;
  rate_id int;
  branch_id uuid;
  contract_type_id int;
  sector_id uuid;

BEGIN
  FOR counter IN 1..row_count
    LOOP
      SELECT id FROM "Location"
      WHERE "locationName" = 'locationName'
      ORDER BY random()
      LIMIT 1
      INTO location_id;

      SELECT id FROM "Status"
      WHERE "name" = 'K6StatusName'
      ORDER BY random()
      LIMIT 1
      INTO status_id;

      SELECT id FROM "Client"
      WHERE "name" = 'K6ClientName'
      ORDER BY random()
      LIMIT 1
      INTO client_id;

      SELECT id FROM "User"
      WHERE "User".email LIKE 'testk6%'
      ORDER BY random()
      LIMIT 1
      INTO user_id;

      SELECT id FROM "ServiceType"
      WHERE name = 'K6ServiceTypeName'
      ORDER BY random()
      LIMIT 1
      INTO service_type_id;

      SELECT id FROM "Shift"
      WHERE name = 'K6ShiftName'
      ORDER BY random()
      LIMIT 1
      INTO shift_id;

      SELECT id FROM "Rate"
      WHERE "keyName" = 'k6Test'
      ORDER BY random()
      LIMIT 1
      INTO rate_id;

      SELECT id FROM "EmploymentType"
      WHERE "name" LIKE '%k6'
      ORDER BY random()
      LIMIT 1
      INTO employment_type_id;

      INSERT INTO "JobOrder"("tenantId", "userId", "clientId", "locationId", "branchId", "serviceTypeId", "shiftId", "rateId", "employmentTypeId", "contractTypeId", "jobRoleId", "sectorId", "sectorLevelId", "statusId", name, "numberOfOpenings", salary, "salaryHigh", "jobDescription", "dayOneGuidance", "additionalInformation", "daysInWeek", rejected, "experienceId")
      VALUES (tenant_id, user_id, client_id, location_id, branch_id, service_type_id, shift_id, rate_id, employment_type_id, contract_type_id, job_role_id, sector_id, level_id, status_id, 'K6JobOrderName', 10, 1000, 10000, 'jobDescription', 'dayOneGuidance', 'additionalInformation', '{monday,tuesday,wednesday,thursday,friday}', false, 14);

    END LOOP;
END
$$ LANGUAGE plpgsql;

select insert_other_data(100, 137);
select insert_job_order_data(1000, 137);
select insert_job_order_data(2000, 137);
select insert_job_order_data(3000, 137);
select insert_job_order_data(4000, 137);
