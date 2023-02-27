-- Deploy opet:ad_functions to pg

BEGIN;

CREATE OR REPLACE FUNCTION new_ad(ad_data json) RETURNS "ad" AS $$
  INSERT INTO "ad" ("title", "content", "city", "postal_code", "user_id")
  VALUES (
    ad_data->>'title',
    ad_data->>'content',
    ad_data->>'city',
    (ad_data->>'postal_code')::postal_code_fr,
    (ad_data->>'user_id')::integer
  )
  RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION update_ad(ad_data json) RETURNS "ad" AS $$
  UPDATE "ad"
  SET
    "title" = ad_data->>'title',
    "content" = ad_data->>'content',
    "city" = ad_data->>'city',
    "postal_code" = (ad_data->>'postal_code')::postal_code_fr,
    "updated_at" = now()
  WHERE "id" = (ad_data->>'id')::integer
  RETURNING *;
$$ LANGUAGE sql STRICT;

COMMIT;
