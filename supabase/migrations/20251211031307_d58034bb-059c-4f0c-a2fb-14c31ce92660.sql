-- Create a function to check feedback rate limit (server-side protection)
CREATE OR REPLACE FUNCTION public.check_feedback_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if same email submitted within last hour (max 5 submissions)
  IF (
    SELECT COUNT(*) 
    FROM public.feedback 
    WHERE email = NEW.email 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to enforce rate limit on insert
DROP TRIGGER IF EXISTS enforce_feedback_rate_limit ON public.feedback;
CREATE TRIGGER enforce_feedback_rate_limit
  BEFORE INSERT ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.check_feedback_rate_limit();