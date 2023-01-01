insert into countries (id, country)
values (1, 'USA')
on conflict (id) do update set country = excluded.country;