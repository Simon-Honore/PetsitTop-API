-- SQLBook: Code
-- Deploy opet:init to pg

BEGIN;

CREATE DOMAIN email AS TEXT
  CHECK(VALUE ~ '^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]{2,}[.][a-zA-Z]{2,}$');

CREATE DOMAIN postal_code_fr AS TEXT
  CHECK(value ~ '^0[1-9]\d{3}$' -- code postaux de 01 à 09
  OR value ~ '^1\d{4}$' -- code postaux du 10 au 19
  OR value ~ '^20[012]\d{2}$|^20600$|^20620$' -- code postaux Corse
  OR value ~ '^2[1-9]\d{3}$' -- code postaux du 21 au 29
  OR value ~ '^[3-8]\d{4}$' -- code postaux du 30 au 89
  OR value ~ '^9[0-5]\d{3}$' -- code postaux du 90 au 95
  OR value ~ '^9[78]\d{3}$' -- code postaux du 97 au 98
);


CREATE TABLE "user" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "email" email NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "postal_code" postal_code_fr NOT NULL,
  "city" TEXT NOT NULL,
  "presentation" TEXT,
  "availability" BOOLEAN NOT NULL DEFAULT false,
  "availability_details" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "pet_type" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "pet" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "presentation" TEXT,
  "user_id" INT REFERENCES "user"("id"),
  "pet_type_id" INT REFERENCES "pet_type"("id"), 
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "ad" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "postal_code" postal_code_fr NOT NULL,
  "user_id" INT REFERENCES "user"("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "role" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user_has_pet_type" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "user_id" INT REFERENCES "user"("id"),
  "pet_type_id" INT REFERENCES "pet_type"("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ,
  UNIQUE("user_id","pet_type_id")
);

CREATE TABLE "user_has_role" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "user_id" INT REFERENCES "user"("id"),
  "role_id" INT REFERENCES "role"("id"),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ,
  UNIQUE("user_id","role_id")
);

COMMIT;
