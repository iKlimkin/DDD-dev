-- Database initialization script for Docker
-- This script runs automatically when PostgreSQL container starts for the first time

-- Create user and database
DROP DATABASE IF EXISTS example;
DROP USER IF EXISTS marcus;
CREATE USER marcus WITH PASSWORD 'marcus';
CREATE DATABASE example OWNER marcus;

-- Connect to example database
\c example

-- Create structure
CREATE TABLE "users" (
  "id" bigint generated always as identity,
  "login" varchar NOT NULL,
  "password" varchar NOT NULL
);

ALTER TABLE "users" ADD CONSTRAINT pkUsers PRIMARY KEY (id);
CREATE UNIQUE INDEX akUsersLogin ON "users" (login);

CREATE TABLE "session" (
  "id" bigint generated always as identity,
  "user" integer NOT NULL,
  "token" varchar(64) NOT NULL,
  "ip" varchar(45) NOT NULL,
  "data" text
);

ALTER TABLE "session" ADD CONSTRAINT pkSession PRIMARY KEY (id);
CREATE UNIQUE INDEX akSession ON "session" (token);
ALTER TABLE "session" ADD CONSTRAINT fkSessionUserId FOREIGN KEY ("user") REFERENCES "users" (id) ON DELETE CASCADE;

CREATE TABLE "country" (
  "id" bigint generated always as identity,
  "name" varchar NOT NULL
);

ALTER TABLE "country" ADD CONSTRAINT "pkCountry" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "akCountry" ON "country" ("name");

CREATE TABLE "city" (
  "id" bigint generated always as identity,
  "name" varchar NOT NULL,
  "country" bigint NOT NULL
);

ALTER TABLE "city" ADD CONSTRAINT "pkCity" PRIMARY KEY ("id");

CREATE UNIQUE INDEX "akCity" ON "city" ("name");

ALTER TABLE "city" ADD CONSTRAINT "fkCityCountry" FOREIGN KEY ("country") REFERENCES "country" ("id") ON DELETE CASCADE;

-- Insert data
INSERT INTO "users" ("login", "password") VALUES
  ('admin', 'ypMEd9FwvtlOjcvH94iICQ==:V6LnSOVwXzENxeLCJk59Toadea7oaA1IxYulAOtKkL9tBxjEPOw085vYalEdLDoe8xbrXQlhh7QRGzrSe8Bthw=='),
  ('marcus', 'dpHw0OUNBz76nuqrXZbeYQ==:wpvUVgi8Yp9rJ0yZyBWecaWP2EL/ahpxZY74KOVfhAYbAZSq6mWqjsQwtCvIPcSKZqUVpVb13JcSciB2fA+6Tg=='),
  ('user', 'r8zb8AdrlPSh5wNy6hqOxg==:HyO5rvOFLtwzU+OZ9qFi3ADXlVccDJWGSfUS8mVq43spJ6sxyliUdW3i53hOPdkFAtDn3EAQMttOlIoJap1lTQ=='),
  ('iskandar', 'aqX1O4bKXiwC/Jh2EKNIYw==:bpE4TARNg09vb2Libn1c00YRxcvoklB9zVSbD733LwQQFUuAm7WHP85PbZXwEbbeOVPIFHgflR4cvEmvYkr76g==');

INSERT INTO "country" ("name") VALUES
  ('Soviet Union'),
  ('People''s Republic of China'),
  ('Vietnam'),
  ('Cuba');

INSERT INTO "city" ("name", "country") VALUES
  ('Beijing', 2),
  ('Wuhan', 2),
  ('Kiev', 1),
  ('Havana', 4),
  ('Hanoi', 3),
  ('Kaliningrad', 1);

