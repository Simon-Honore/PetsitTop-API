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

COMMIT;
