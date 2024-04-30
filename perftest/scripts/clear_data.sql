CREATE OR REPLACE FUNCTION clear_other_data() RETURNS void AS
$$
BEGIN
  DELETE FROM "JobOrder" WHERE name = 'K6JobOrderName';
  DELETE FROM "Rate" WHERE name = 'k6Test';
  DELETE FROM "EmploymentType" WHERE name LIKE '%k6';
  DELETE FROM "Sector" WHERE name = 'K6SectorName';
  DELETE FROM "Shift" WHERE name = 'K6ShiftName';
  DELETE FROM "Branch" WHERE name = 'K6BranchName';
  DELETE FROM "Level" WHERE name LIKE 'K6LevelName%';
  DELETE FROM "ServiceType" WHERE name = 'K6ServiceTypeName';
  DELETE FROM "Notification" WHERE "entityName" = 'K6entityName';
  DELETE FROM "JobRole" WHERE name = 'K6TestRole';
  DELETE FROM "Invoice" WHERE "creditNotes" = 'K6Test';
  DELETE FROM "Contract" WHERE "number" LIKE 'K6StatusNumber%';
  DELETE FROM "Type" WHERE "name" = 'K6TypeName';
  DELETE FROM "CaseCategory" WHERE name = 'K6CaseCategoryName';
END
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION clear_user_data() RETURNS void AS
$$
BEGIN
  RAISE NOTICE 'clear_user_data started';
  DELETE FROM "TenantUser" WHERE "TenantUser"."otherDisableReason" LIKE 'testk6%';
  DELETE FROM "DisableReason" WHERE "DisableReason".reason LIKE 'testk6%';
  DELETE FROM "Status" WHERE name = 'K6StatusName';
  DELETE FROM "UserConsent" WHERE "consentId" IN (SELECT id FROM "Consent" where url = 'k6test');
  DELETE FROM "Consent" where url = 'k6test';
  DELETE FROM "UserProfile" WHERE title = 'K6TestUser';
  DELETE FROM "User" WHERE email LIKE 'testk6%';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION clear_nonreferent_data() RETURNS void AS
$$
BEGIN
  DELETE FROM "Workplace" WHERE "wifiId" = 'testWIFI';
  DELETE FROM "Location" WHERE "locationName" = 'k6locationName';
  DELETE FROM "ClientConfiguration" WHERE config ? 'k6Test';
  DELETE FROM "Client" WHERE name = 'K6ClientName';
  DELETE FROM "DepartmentFunction" WHERE name = 'K6DepartmentFunctionName';
  DELETE FROM "Department" WHERE name = 'K6DepartmentName';
  DELETE FROM "Tenant" WHERE name = 'K6TenantName';
  DELETE FROM "Country" WHERE name = 'K6CountryName';
END
$$ LANGUAGE plpgsql;

SELECT clear_other_data();
SELECT clear_user_data();
SELECT clear_nonreferent_data();
