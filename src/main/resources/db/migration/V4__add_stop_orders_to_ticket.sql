ALTER TABLE tickets
ADD COLUMN source_stop_order INTEGER NOT NULL;

ALTER TABLE tickets
ADD COLUMN destination_stop_order INTEGER NOT NULL;