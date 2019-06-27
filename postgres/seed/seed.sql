BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) VALUES ('Renato', 'renatoamreis@gmail.com', 999, '2018-06-26');
INSERT into login (hash, email) VALUES ('$2a$10$Qzp3n9UrwX7ULePZphbhvug.jvvx61OKNJrgBBS9FXDYSbVy./L3W', 'renatoamreis@gmail.com');

COMMIT;