
alter table users add column search_last_notification timestamp(6);

alter table users add column search_notification_frequency int;

alter table users add column search_notification_criteria varchar;
