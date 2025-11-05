-- Script to create MAPP_DB database
-- Run this script with SQL Server Management Studio or sqlcmd with admin privileges

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'MAPP_DB')
BEGIN
    CREATE DATABASE MAPP_DB;
    PRINT 'Database MAPP_DB created successfully.';
END
ELSE
BEGIN
    PRINT 'Database MAPP_DB already exists.';
END
GO

