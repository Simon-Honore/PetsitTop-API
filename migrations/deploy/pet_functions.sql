-- Deploy opet:pet_functions to pg

BEGIN;

CREATE OR REPLACE FUNCTION new_pet(pet_data json) RETURNS "pet" AS $$
  INSERT INTO "pet" ("name", "presentation", "user_id", "pet_type_id")
  VALUES (
    pet_data->>'name',
    pet_data->>'presentation',
    (pet_data->>'user_id')::int,
    (pet_data->>'pet_type_id')::int
  )
  RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE FUNCTION update_pet(pet_id int, pet_data json) RETURNS pet AS $$
  UPDATE "pet" SET
    "name" = pet_data->>'name',
    "presentation" = pet_data->>'presentation',
    "pet_type_id" = (pet_data->>'pet_type_id')::int,
    "updated_at" = now()
  WHERE "id" = pet_id
  RETURNING *;
$$ LANGUAGE sql STRICT;



COMMIT;
