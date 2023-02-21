-- Revert opet:user_functions from pg

BEGIN;

DROP FUNCTION "new_user";

COMMIT;
