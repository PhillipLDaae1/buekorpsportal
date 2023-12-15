INSERT INTO companies (company_name) VALUES ('Kompani 1');
INSERT INTO companies (company_name) VALUES ('Kompani 2');

INSERT INTO platoons (platoon_name, company_id) VALUES ('peletong 1', 1);
INSERT INTO platoons (platoon_name, company_id) VALUES ('peletong 2', 1);
INSERT INTO platoons (platoon_name, company_id) VALUES ('peletong 1', 2);
INSERT INTO platoons (platoon_name, company_id) VALUES ('peletong 2', 2);

INSERT INTO users (platoon_id) VALUES (1);

UPDATE users
SET platoon_id = 2
WHERE id = 1;
