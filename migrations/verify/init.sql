-- Verify opet:init on pg

BEGIN;

SELECT * FROM "pet" WHERE false;

SELECT * FROM "user" WHERE false;

SELECT * FROM "ad" WHERE false;

SELECT * FROM "pet_type" WHERE false;

SELECT * FROM "role" WHERE false;

SELECT * FROM "user_has_pet_type" WHERE false;

SELECT * FROM "user_has_role" WHERE false;

ROLLBACK;
