CREATE TABLE IF NOT EXISTS admission_forms (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  description VARCHAR(1000),
  slug VARCHAR(120) NOT NULL,
  deadline DATETIME(6) NOT NULL,
  is_active BIT NOT NULL,
  fields_json TEXT,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_admission_forms_slug (slug)
);

CREATE TABLE IF NOT EXISTS admission_submissions (
  id BIGINT NOT NULL AUTO_INCREMENT,
  form_id BIGINT NOT NULL,
  full_name_with_initials VARCHAR(150) NOT NULL,
  age INT,
  gender VARCHAR(30),
  marital_status VARCHAR(50),
  course_applied VARCHAR(150),
  qualification VARCHAR(150),
  current_occupation VARCHAR(150),
  full_address VARCHAR(1000),
  city_town VARCHAR(120),
  whatsapp_number VARCHAR(30),
  church_assembly_name VARCHAR(200),
  evangelist_pastor_name VARCHAR(150),
  answers_json TEXT,
  status VARCHAR(30) NOT NULL,
  submitted_at DATETIME(6) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_admission_submissions_form_id (form_id),
  KEY idx_admission_submissions_status (status),
  CONSTRAINT fk_admission_submissions_form
    FOREIGN KEY (form_id) REFERENCES admission_forms(id)
);
