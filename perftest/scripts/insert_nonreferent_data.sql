CREATE OR REPLACE FUNCTION insert_country_data(row_count int) RETURNS void AS
$$
BEGIN
  FOR counter IN 1..row_count
    LOOP
      INSERT INTO "Country" (code, name, "callingCode")
      VALUES (upper(uuid_generate_v4()::VARCHAR(3)), 'K6CountryName', floor(random() * 1000));
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION insert_tenant_data(row_count int) RETURNS void AS
$$
BEGIN
  FOR counter IN 1..row_count
    LOOP
      WITH inserted_countries AS (
        INSERT INTO "Country" (code, name, "callingCode")
          VALUES (uuid_generate_v4()::VARCHAR(10), 'K6CountryName', uuid_generate_v4()::VARCHAR(10))
          RETURNING id AS country_id
      )
      INSERT
      INTO "Tenant" (id, domain, name, alias, "appConfig", brand, "countryId", website, "destinationSystem")
      SELECT (SELECT MAX(id) + 1 FROM "Tenant"),
             'http://localhost:3001/invitation/invitationId?tenantId=110',
             'K6TenantName',
             uuid_generate_v4()::VARCHAR(10),
             '{"componentsVersion": 2}',
             'Brand',
             inserted_countries.country_id,
             'dummy_test_website',
             'Infoeurope'
      FROM inserted_countries;
    END LOOP;
END
$$ LANGUAGE plpgsql;

--
DROP FUNCTION IF EXISTS insert_client_data(integer,integer);

CREATE OR REPLACE FUNCTION insert_client_data(row_count int, tenant_id int) RETURNS void AS
$$
DECLARE
  country_id uuid;
  client_id uuid;

BEGIN
  FOR counter IN 1..row_count
    LOOP
      SELECT id FROM "Country"
      WHERE name = 'K6CountryName'
      ORDER BY random()
      LIMIT 1
      INTO country_id;

      INSERT INTO "Client" (id, name, "countryId")
      VALUES (uuid_generate_v4(), 'K6ClientName', country_id)
      RETURNING id INTO client_id;

      INSERT INTO "ClientConfiguration"("tenantId", channel, feature, "clientId", config, "roleId")
      VALUES (tenant_id, 'CLA', 'mainMenu', client_id, '{"k6Test": [], "disabledMenus": [], "clientMenuItems": [{"link": "/client/job-orders", "name": "onsitePortal", "hostName": "ONSITE", "iconName": "CityNext2", "linkType": "RELATIVE"}]}', 1);

    END LOOP;
END
$$ LANGUAGE plpgsql;


--
CREATE OR REPLACE FUNCTION insert_location_workplace_data(row_count int) RETURNS void AS
$$
DECLARE
  client_id uuid;
  location_id uuid;

BEGIN
  FOR counter IN 1..row_count
    LOOP
        SELECT id FROM "Client"
        WHERE name='K6ClientName'
        ORDER BY random()
        LIMIT 1 OFFSET counter
        INTO client_id;

        INSERT INTO "Location" (id, "clientId", "isMainLocation", "locationName", street, number, city, state, country, zip, status)
        VALUES (uuid_generate_v4(),
              client_id,
              true,
              'k6locationName',
              'street',
              '45',
              'city',
              'state',
              'country',
              'zip',
              'status')
        RETURNING id into location_id;

        INSERT INTO "Workplace" ("locationId", "parentLocationId", "workEnvironment", "wifiId", "qrCode", status)
        VALUES (location_id,
                location_id,
                'workEnviroment',
                'testWIFI',
                'qrCode',
                'open'
                );
    END LOOP;
END
$$ LANGUAGE plpgsql;
--
CREATE OR REPLACE FUNCTION insert_department_data(row_count int) RETURNS void AS
$$
DECLARE
  department_id uuid;

BEGIN
  FOR counter IN 1..row_count
    LOOP
      INSERT INTO "Department" (id, name, "keyName")
      VALUES (uuid_generate_v4(), 'K6DepartmentName', 'keyName')
      RETURNING id INTO department_id;

      INSERT INTO "DepartmentFunction"(id, name, "departmentId", "keyName")
      VALUES (uuid_generate_v4(), 'K6DepartmentFunctionName', department_id, 'keyName');
    END LOOP;
END
$$ LANGUAGE plpgsql;


-- Tenant (10) and Country (10)
select insert_country_data(10);
select insert_tenant_data(10);
-- Client(1000)
select insert_client_data(1000, 137);
-- Location (10)
-- Workplace (10)
select insert_location_workplace_data(100);
--Department (10)
select insert_department_data(100);

