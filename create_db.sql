 create table events(
        id serial not null,
        name text,
        description text,
        date integer,
        reward_per_sell integer);

create table influencers(
 id serial not null,
 name text,
 password text,
 email text unique,
 wallet_id text unique,
 wallet_address text unique,
 referral_code text unique);


create table vaults(
id serial not null, address text unique,
name text,
symbol text, chain_Id integer,
coin_Contract text,
coin_Name text,
vault_Creator_Treasury text,
dev_Treasury text,
reserve_Fee integer,
vault_Creator_Fee integer,
dev_Fee integer);