do $$
begin
  if not exists (select from pg_catalog.pg_roles where rolname = '${processorUser}') then
    create role ${processorUser};
  end if;
  alter role ${processorUser} with password '${processorPassword}' login;
end$$;

grant readwrite to ${processorUser}
