CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  company_id INTEGER,
  platoon_id INTEGER,
  email TEXT NOT NULL,
  phone INTEGER,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  FOREIGN KEY(company_id) REFERENCES companies(companies_id),
  FOREIGN KEY(platoon_id) REFERENCES platoons(platoons_id)
);

CREATE TABLE platoons (
  platoons_id INTEGER PRIMARY KEY,
  platoon_name TEXT NOT NULL,
  company_id INTEGER,
  FOREIGN KEY(company_id) REFERENCES companies(companies_id)
);

CREATE TABLE companies (
  companies_id INTEGER PRIMARY KEY,
  company_name TEXT NOT NULL
);

CREATE TABLE parents (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  contact_info TEXT
);

CREATE TABLE parent_child (
  parent_id INTEGER,
  child_id INTEGER,
  PRIMARY KEY(parent_id, child_id),
  FOREIGN KEY(parent_id) REFERENCES parents(id),
  FOREIGN KEY(child_id) REFERENCES users(id)
);
