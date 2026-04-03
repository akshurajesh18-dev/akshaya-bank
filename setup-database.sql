-- ============================================================
-- Akshaya Bank - MySQL Setup
-- Run this ONCE in MySQL Workbench or mysql CLI:
--   mysql -u root -pSystem < setup-database.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS akshaya_bank
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE akshaya_bank;

SELECT 'Database akshaya_bank created successfully!' AS Status;
-- Tables are auto-created by Spring Boot (ddl-auto=update)
