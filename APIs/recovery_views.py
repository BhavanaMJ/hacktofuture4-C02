from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import User


# -----------------------------
# RECOVERY CODE STEP-UP VERIFICATION
# -----------------------------

class RecoveryVerifyView(APIView):
    """
    Step-Up Verification using a one-time recovery code.

    POST /api/recovery/verify/
    Input:  { "username": "...", "recovery_code": "..." }
    Output: Success → marks user as is_recovered=True
            Failure → error response
    """

    def post(self, request):
        username = request.data.get("username")
        recovery_code = request.data.get("recovery_code")

        # --- Basic field validation ---
        if not username or not recovery_code:
            return Response(
                {"message": None, "data": None, "error": "username and recovery_code are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Lookup user ---
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"message": None, "data": None, "error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # --- Match recovery code ---
        if not user.recovery_code or user.recovery_code != recovery_code.strip().upper():
            return Response(
                {"message": None, "data": None, "error": "Invalid recovery code"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Mark step-up as successful ---
        user.is_recovered = True
        user.save(update_fields=["is_recovered"])

        return Response(
            {
                "message": "Identity verified via recovery code",
                "data": {"user_name": user.username, "is_recovered": True},
                "error": None
            },
            status=status.HTTP_200_OK
        )
