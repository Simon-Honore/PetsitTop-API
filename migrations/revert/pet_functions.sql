-- Revert opet:pet_functions from pg

BEGIN;

DROP FUNCTION "new_pet";

COMMIT;
