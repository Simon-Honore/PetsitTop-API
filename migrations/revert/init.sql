-- Revert opet:init from pg

BEGIN;

DROP TABLE "pet","user","ad","pet_type","role","user_has_pet_type", "user_has_role";

COMMIT;
