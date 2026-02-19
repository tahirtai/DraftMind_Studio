-- ============================================================
-- Migration: recover_user RPC
-- Description: Allows soft-deleted users to restore their account.
--   Clears the deleted_at timestamp and resets status to 'active'.
--   Uses auth.uid() so users can only recover their own account.
--   Idempotent — safe to call multiple times; no-op if not deleted.
-- ============================================================

-- Create the RPC function
CREATE OR REPLACE FUNCTION public.recover_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.profiles
    SET
        deleted_at = NULL,
        status = 'active',
        updated_at = NOW()
    WHERE id = auth.uid()
      AND (deleted_at IS NOT NULL OR status = 'deleted');
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.recover_user() TO authenticated;

-- Add function comment for documentation
COMMENT ON FUNCTION public.recover_user() IS
    'Restores a soft-deleted user account. Clears deleted_at, sets status to active. '
    'Scoped to auth.uid() — users can only recover their own account. '
    'Idempotent: no-op if user is not currently soft-deleted.';


-- ============================================================
-- TEST QUERY (run manually while authenticated as a deleted user):
-- ============================================================
-- SELECT recover_user();
--
-- Verify it worked:
-- SELECT id, full_name, status, deleted_at, updated_at
-- FROM profiles
-- WHERE id = auth.uid();


-- ============================================================
-- ROLLBACK (to remove the function if needed):
-- ============================================================
-- REVOKE EXECUTE ON FUNCTION public.recover_user() FROM authenticated;
-- DROP FUNCTION IF EXISTS public.recover_user();
