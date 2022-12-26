do $$
begin
  if not exists (select from pg_catalog.pg_roles where rolname = '${readonlyUser}') then
    create role ${readonlyUser};
  end if;
  alter role ${readonlyUser} with password '${readonlyPassword}' login;
end$$;

grant readonly to ${readonlyUser}
