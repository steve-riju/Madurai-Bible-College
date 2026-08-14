SET @email_column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'admission_submissions'
    AND COLUMN_NAME = 'email'
);

SET @add_email_column_sql = IF(
  @email_column_exists = 0,
  'ALTER TABLE admission_submissions ADD COLUMN email VARCHAR(150) AFTER full_name_with_initials',
  'SELECT 1'
);

PREPARE add_email_column_statement FROM @add_email_column_sql;
EXECUTE add_email_column_statement;
DEALLOCATE PREPARE add_email_column_statement;
