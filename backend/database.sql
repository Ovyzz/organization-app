CREATE DATABASE organizationApp;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS peoples (
    id SERIAL PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    jobTitle TEXT NOT NULL,
    creator TEXT NOT NULL,
    createAt TIMESTAMP NOT NULL,
    updateAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    groupName TEXT NOT NULL,
    creator TEXT NOT NULL,
    createAt TIMESTAMP NOT NULL,
    updateAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS groupDetail (
    id SERIAL PRIMARY KEY,
    idCreator INT NOT NULL,
    idGroup INT NOT NULL,
    createAt TIMESTAMP NOT NULL,
    updateAt TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (idCreator) REFERENCES peoples(id)
);

CREATE TABLE IF NOT EXISTS groupTree (
    id SERIAL PRIMARY KEY,
    parent TEXT NOT NULL,
    child TEXT NOT NULL,
    creator TEXT NOT NULL,
    createAt TIMESTAMP NOT NULL,
    FOREIGN KEY (id) REFERENCES groups(id)
);
