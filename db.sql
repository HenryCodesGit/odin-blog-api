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
    ispublished BOOLEAN DEFAULT FALSE
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

-------------------------------

CREATE TABLE comment(
    cid SERIAL PRIMARY KEY,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    post_id INT NOT NULL,
    FOREIGN KEY(post_id)
        REFERENCES post(pid)
        ON UPDATE CASCADE --If the primary key for some reason updates in parent table, it gets updated here too
        ON DELETE CASCADE --If the parent is deleted, the comments get deleted with it
);

-- QUERY TO UPDATE ANY POSTS:
UPDATE comment
SET --ANYTHING CAN GO HERE
WHERE --ANYTHING CAN GO HERE
RETURNING *;