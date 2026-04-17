from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from authcore.models import User


# -----------------------------
# RECOVERY CODE STEP-UP VERIFICATION
# Keep this view separate from views.py — clean separation of concerns.
# -----------------------------

class   RecoveryVerifyView(APIView):
    """
    Step-Up Verification using the one-time recovery code.

    POST /api/auth/recovery/verify
    Input:  { "email": "...", "recovery_code": "..." }
    Output: Success → marks is_recovered=True and confirms identity
            Failure → error response

    Security:
    - Does NOT accept password — purely code-based step-up
    - Code comparison is case-insensitive (stored as uppercase)
    - is_recovered is a TEMPORARY session flag (reset on next auth)
    """

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        recovery_code = request.data.get("recovery_code", "").strip().upper()

        # --- Basic field validation ---
        if not email or not recovery_code:
            return Response(
                {
                    "message": None,
                    "data": None,
                    "error": "email and recovery_code are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Lookup user ---
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {
                    "message": None,
                    "data": None,
                    "error": "User not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # --- Match recovery code ---
        if not user.recovery_code or user.recovery_code.upper() != recovery_code:
            return Response(
                {
                    "message": None,
                    "data": None,
                    "error": "Invalid recovery code"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Mark step-up as successful and lift lockdown ---
        user.is_recovered = True
        user.system_lockdown = False
        user.save(update_fields=["is_recovered", "system_lockdown"])

        return Response(
            {
                "message": "Identity verified via recovery code",
                "data": {
                    "user_id": str(user.user_id),
                    "email": user.email,
                    "is_recovered": True
                },
                "error": None
            },
            status=status.HTTP_200_OK
        )
