CREATE TABLE IF NOT EXISTS batch_courses (
  batch_id BIGINT NOT NULL,
  course_assigned_id BIGINT NOT NULL,
  PRIMARY KEY (batch_id, course_assigned_id),
  CONSTRAINT fk_bc_batch
    FOREIGN KEY (batch_id) REFERENCES batches(id),
  CONSTRAINT fk_bc_course
    FOREIGN KEY (course_assigned_id) REFERENCES course_assigned(id)
);

CREATE TABLE IF NOT EXISTS batch_students (
  batch_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  PRIMARY KEY (batch_id, student_id),
  CONSTRAINT fk_bs_batch
    FOREIGN KEY (batch_id) REFERENCES batches(id),
  CONSTRAINT fk_bs_student
    FOREIGN KEY (student_id) REFERENCES users(id)
);
