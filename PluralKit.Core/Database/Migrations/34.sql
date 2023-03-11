-- database version 34
-- create applications and tokens for oauth2 on the api

create table if not exists applications
(
    id           serial primary key,
    uuid         uuid default gen_random_uuid(),
    name         text not null,
    avatar_url   text,
    description  text,
    redirect_url text
);

create index applications_uuid_idx on applications(uuid);

create table if not exists tokens
(
    id          serial primary key,
    token       text not null,
    system      serial not null references systems (id) on delete cascade,
    application serial references applications (id) on delete cascade,
    scope       bigint not null
);

update info set schema_version = 34;