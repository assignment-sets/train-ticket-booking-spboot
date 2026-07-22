-- 1. Add the column as nullable first so the 180 seeded rows don't crash
ALTER TABLE seats ADD COLUMN train_id BIGINT;

-- 2. Map all your existing seed seats to your only train (ID = 1)
UPDATE seats 
SET train_id = 1 
WHERE train_id IS NULL;

-- 3. Now that no rows are null, safely make it NOT NULL
ALTER TABLE seats ALTER COLUMN train_id SET NOT NULL;

-- 4. Wire up the Foreign Key constraint to the trains table
ALTER TABLE seats 
ADD CONSTRAINT fk_seat_train
FOREIGN KEY (train_id)
REFERENCES trains(id)
ON DELETE CASCADE;

-- 5. Drop the old unique constraint that limits you to only one train total
ALTER TABLE seats DROP CONSTRAINT uq_seat;

-- 6. Add the new composite unique constraint (Unique per individual train)
ALTER TABLE seats 
ADD CONSTRAINT uq_train_coach_seat 
UNIQUE(train_id, coach_number, seat_number);