--Database operations that were done to set up the project

CREATE DATABASE odin-blog;

CREATE TABLE admin(
    userID SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO admin (username,password) VALUES (
    --PLACE USERNAME HERE BEFORE RUNNING THE QUERY,
    --PLACE PASSWORD HERE BEFORE RUNNING THE QUERY,
);


-------------------------------

CREATE TABLE post(
    pid SERIAL PRIMARY KEY,
    title TEXT,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP ,
    isPublished BOOLEAN DEFAULT FALSE
    --TODO: Eventually add tags?
)

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_updated_at_trigger
BEFORE UPDATE ON post
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- QUERY TO UPDATE ANY POSTS:
UPDATE post
SET --ANYTHING CAN GO HERE
WHERE --ANYTHING CAN GO HERE
RETURNING *;