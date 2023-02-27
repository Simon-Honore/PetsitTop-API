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



COMMIT;
