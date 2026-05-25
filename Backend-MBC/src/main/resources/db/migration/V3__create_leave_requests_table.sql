CREATE TABLE IF NOT EXISTS leave_requests (
  id BIGINT NOT NULL AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(1000) NOT NULL,
  leave_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  applied_date DATETIME(6) NOT NULL,
  admin_remarks VARCHAR(1000),
  PRIMARY KEY (id),
  KEY idx_leave_requests_student_id (student_id),
  KEY idx_leave_requests_status (status),
  KEY idx_leave_requests_dates (start_date, end_date),
  CONSTRAINT fk_leave_requests_student
    FOREIGN KEY (student_id) REFERENCES users(id)
);
