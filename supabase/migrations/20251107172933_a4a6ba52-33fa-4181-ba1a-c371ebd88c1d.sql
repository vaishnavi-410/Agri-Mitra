-- Force a schema refresh by altering table storage parameters
ALTER TABLE public.chat_history SET (fillfactor = 90);
ALTER TABLE public.profiles SET (fillfactor = 90);

-- Add helpful table comments
COMMENT ON COLUMN public.chat_history.id IS 'Unique identifier for each chat message';
COMMENT ON COLUMN public.chat_history.user_id IS 'Reference to the authenticated user';
COMMENT ON COLUMN public.profiles.id IS 'User ID matching auth.users.id';