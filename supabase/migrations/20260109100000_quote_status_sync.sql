create or replace function public.sync_intervention_status_from_quote()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'draft' then
    update interventions set status = 'quote_draft' where id = new.intervention_id;
  elsif new.status = 'sent' then
    update interventions set status = 'quote_sent' where id = new.intervention_id;
  elsif new.status = 'accepted' then
    update interventions set status = 'quote_accepted' where id = new.intervention_id;
  elsif new.status = 'rejected' then
    update interventions set status = 'quote_rejected' where id = new.intervention_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_quotes_sync_intervention_status on quotes;

create trigger trg_quotes_sync_intervention_status
after insert or update of status on quotes
for each row
execute function public.sync_intervention_status_from_quote();