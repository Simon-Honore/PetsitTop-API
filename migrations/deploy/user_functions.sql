-- SQLBook: Code
-- Deploy opet:user_functions to pg

BEGIN;

-- Function to create a new user
CREATE OR REPLACE FUNCTION new_user(user_data json) RETURNS "user" AS $$
  INSERT INTO "user" ("first_name", "last_name", "email", "password", "postal_code", "city", "availability", "availability_details")
  VALUES (
    user_data->>'first_name',
    user_data->>'last_name',
    (user_data->>'email')::email,
    user_data->>'password',
    (user_data->>'postal_code')::postal_code_fr,
    user_data->>'city',
    (user_data->>'availability')::boolean,
    user_data->>'availability_details'
  )
  RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION new_user_has_role(user_has_role_data json) RETURNS "user_has_role" AS $$
  INSERT INTO "user_has_role" ("user_id", "role_id")
  VALUES (
    (user_has_role_data->>'user_id')::int,
    (user_has_role_data->>'role_id')::int
  )
  RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION new_user_has_pet_type(user_id_data int, pet_type_data int[])
RETURNS SETOF "user_has_pet_type" AS $$
  DECLARE
    x int;
  BEGIN
    FOREACH x IN ARRAY pet_type_data
    LOOP
      RETURN QUERY
        INSERT INTO "user_has_pet_type" ("user_id", "pet_type_id")
        VALUES (user_id_data, x)
        RETURNING *;
        
    END LOOP;
    RETURN;

  END;
$$ LANGUAGE plpgsql STRICT;

-- Function to modify a user with email
CREATE OR REPLACE FUNCTION update_userwithemail(user_data json) RETURNS "user" AS $$
  UPDATE "user" SET
    "first_name" = user_data->>'first_name',
    "last_name" = user_data->>'last_name',
    "email" = (user_data->>'email')::email,
    "postal_code" = (user_data->>'postal_code')::postal_code_fr,
    "city" = user_data->>'city',
    "presentation" = user_data->>'presentation',
    "availability" = (user_data->>'availability')::boolean,
    "availability_details" = user_data->>'availability_details',
    "updated_at" = now()
  WHERE "id" = (user_data->>'id')::int
  RETURNING *;

$$ LANGUAGE sql STRICT;

-- Function to modify a user without email
CREATE OR REPLACE FUNCTION update_user(user_data json) RETURNS "user" AS $$
  UPDATE "user" SET
    "first_name" = user_data->>'first_name',
    "last_name" = user_data->>'last_name',
    "postal_code" = (user_data->>'postal_code')::postal_code_fr,
    "city" = user_data->>'city',
    "presentation" = user_data->>'presentation',
    "availability" = (user_data->>'availability')::boolean,
    "availability_details" = user_data->>'availability_details',
    "updated_at" = now()
  WHERE "id" = (user_data->>'id')::int
  RETURNING *;

$$ LANGUAGE sql STRICT;

COMMIT;
