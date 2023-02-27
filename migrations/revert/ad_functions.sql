-- Revert opet:ad_functions from pg

BEGIN;

DROP FUNCTION "new_ad", "update_ad";

COMMIT;
