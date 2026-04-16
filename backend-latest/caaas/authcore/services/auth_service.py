from authcore.models import User
import uuid


def register_user(email, password):
    user_id = str(uuid.uuid4())

    user = User(
        user_id=user_id,
        email=email
    )
    user.set_password(password)
    user.save()

    return user


def authenticate_user(email, password):
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return None

    if user.check_password(password):
        return user

    return None