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

COMMIT;
