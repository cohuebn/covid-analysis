CREATE TABLE IF NOT EXISTS vaccinations (
  id CHAR(44) NOT NULL,
  time TIMESTAMPTZ NOT NULL,

  PRIMARY KEY (id, time)
);

SELECT create_hypertable('vaccinations', 'time', if_not_exists => TRUE);
