import db from './db'

export default async function initDatabase() {
    await db.query(`create table if not exists competition (
                        competition_id serial,
                        competition_name varchar(255) not null,
                        scoring_system varchar(255) not null,
                        user_id varchar(255) not null,
                        primary key (competition_id)
                    );`)
    await db.query(`create table if not exists competitor (
                        competitor_id serial,
                        competitor_name varchar(255) not null,
                        competition_id int not null,
                        primary key (competitor_id),
                        foreign key (competition_id) references competition(competition_id)
                    );`)
}
