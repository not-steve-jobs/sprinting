CREATE OR REPLACE FUNCTION insert_status_data(status_count int, tenant_id int) RETURNS void AS
$$
DECLARE
  status_id int;

BEGIN
  FOR counter IN 1..status_count LOOP

      SELECT COALESCE(MAX(id) + 1,1) FROM "Status" INTO status_id;

      INSERT INTO "Status"(id, "tenantId", "entityName", name)
      VALUES (status_id, tenant_id, 'entityName', 'K6StatusName');
  END LOOP;
END
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION insert_user_data(users_count int, tenant_id int) RETURNS void AS
$$
DECLARE
  user_id uuid;
  status_id int;
  disableReason_id int;
  client_id uuid;
  location_id uuid;
  department_id uuid;
  department_function_id uuid;

BEGIN
  RAISE NOTICE 'The users_count value is %', users_count;
  RAISE NOTICE 'The tenant_id is %', tenant_id;

  FOR counter IN 1..users_count LOOP

      SELECT id FROM "Client"
      WHERE name = 'K6ClientName'
      ORDER BY random()
      LIMIT 1
      INTO client_id;

      SELECT id FROM "Location"
      WHERE "locationName" = 'k6locationName'
      ORDER BY random()
      LIMIT 1
      INTO location_id;

      SELECT id FROM "Department"
      WHERE name = 'K6DepartmentName'
      ORDER BY random()
      LIMIT 1
      INTO department_id;

      SELECT id FROM "DepartmentFunction"
      WHERE name = 'K6DepartmentFunctionName'
      ORDER BY random()
      LIMIT 1
      INTO department_function_id;

      SELECT id FROM "Status"
      WHERE "name" = 'K6StatusName'
      ORDER BY random()
      LIMIT 1
      INTO status_id;

      SELECT MAX(id) + 1 FROM "DisableReason" INTO disableReason_id;

      INSERT INTO "User" (id, "clientId", "B2CId", email,  "clientTraceId")
      VALUES (uuid_generate_v4(), client_id, uuid_generate_v4(), CONCAT('testk6', (uuid_generate_v4()::text), '@yopmail.com'), CONCAT('CT-', "substring"(upper((uuid_generate_v4())::text), 0, 7)))
      RETURNING id INTO user_id;

      INSERT INTO "UserProfile" (id, "mainLocationId", "departmentId", "departmentFunctionId", "firstName", "lastName", title, "phonePrefix", phone, "otherPhone", "otherPhonePrefix", language, worksite, "dataAccess")
      VALUES (user_id, location_id, department_id, department_function_id, 'testFirstName', 'testLastName', 'K6TestUser', '000',
              '123-456-7899', '555-777-7899', '111', 'en_US', 'London', true);

      INSERT INTO "DisableReason"(id, reason)
      VALUES (disableReason_id, CONCAT('testk6', (uuid_generate_v4()::text)));

      INSERT INTO "TenantUser"("tenantId", "userId", "roleId", "statusId", "disableReasonId", "otherDisableReason")
      VALUES (tenant_id, user_id, 1, status_id, disableReason_id, CONCAT('testk6', (uuid_generate_v4()::text)));

    END LOOP;
END
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_consent_data(consent_count int, tenant_id int) RETURNS void AS
$$
DECLARE
  consent_id uuid;
  user_id uuid;
BEGIN

  FOR counter IN 1..consent_count LOOP

    SELECT id FROM "User"
    WHERE email LIKE 'testk6%'
    ORDER BY random()
    LIMIT 1
    INTO user_id;

      INSERT INTO "Consent"(id, "tenantId", url, type, version, "validFrom")
      VALUES(uuid_generate_v4(), tenant_id, 'k6test', 'type', 1, now())
      RETURNING id INTO consent_id;

      INSERT INTO "UserConsent"("tenantId", "userId", "consentId")
      VALUES (tenant_id, user_id, consent_id);
  END LOOP;
END
$$ LANGUAGE plpgsql;

select insert_status_data(100, 137);
select insert_user_data(20, 137);
select insert_user_data(1000, 137);
select insert_user_data(1000, 137);
select insert_user_data(2000, 137);
select insert_user_data(3000, 137);
select insert_user_data(4000, 137);

select insert_consent_data(100, 137);
