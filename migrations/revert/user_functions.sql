-- Revert opet:user_functions from pg

BEGIN;

DROP FUNCTION "new_user","new_user_has_role", "update_user", "update_userwithemail" ;

COMMIT;