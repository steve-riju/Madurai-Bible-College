SET @teacher_report_table_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'teacher_daily_reports'
);

SET @teacher_report_batch_id_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'teacher_daily_reports'
    AND COLUMN_NAME = 'batch_id'
);

SET @add_teacher_report_batch_id_sql = IF(
  @teacher_report_table_exists > 0 AND @teacher_report_batch_id_exists = 0,
  'ALTER TABLE teacher_daily_reports ADD COLUMN batch_id BIGINT AFTER date',
  'SELECT 1'
);

PREPARE add_teacher_report_batch_id_statement FROM @add_teacher_report_batch_id_sql;
EXECUTE add_teacher_report_batch_id_statement;
DEALLOCATE PREPARE add_teacher_report_batch_id_statement;

SET @teacher_report_course_assigned_id_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'teacher_daily_reports'
    AND COLUMN_NAME = 'course_assigned_id'
);

SET @add_teacher_report_course_assigned_id_sql = IF(
  @teacher_report_table_exists > 0 AND @teacher_report_course_assigned_id_exists = 0,
  'ALTER TABLE teacher_daily_reports ADD COLUMN course_assigned_id BIGINT AFTER batch_name',
  'SELECT 1'
);

PREPARE add_teacher_report_course_assigned_id_statement FROM @add_teacher_report_course_assigned_id_sql;
EXECUTE add_teacher_report_course_assigned_id_statement;
DEALLOCATE PREPARE add_teacher_report_course_assigned_id_statement;
