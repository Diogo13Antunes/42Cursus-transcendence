from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from user_auth.models import User
from io import BytesIO
from PIL import Image

import base64
import imghdr

user_model = ModelManager(User)
user_profile_info_model = ModelManager(UserProfileInfo)

def get_image_url(user):
    if user.compressed_profile_image:
        profile_image = bytes(user.compressed_profile_image)
        image_type = imghdr.what(None, h=profile_image)
        if image_type:
            profile_image_base64 = base64.b64encode(profile_image).decode("utf-8")
            image_url = f"data:image/{image_type};base64,{profile_image_base64}"
        else:
            return
    else:
        image_url = "https://api.dicebear.com/8.x/bottts/svg?seed=" + user.default_image_seed
    return image_url

def set_new_profile_picture(user, new_image):
    new_image_data = new_image.read()
    user.profile_image = new_image_data
    image = Image.open(BytesIO(new_image_data))
    output = BytesIO()
    image.save(output, format='JPEG', quality=25)
    compressed_image_data = output.getvalue()
    user.compressed_profile_image = compressed_image_data
    user.save()
    return True

def set_new_default_seed(user, new_seed):
    user.default_image_seed = new_seed
    user.save()
    return True

def set_new_bio(user, new_bio):
    user.bio = new_bio
    user.save()
    return True

def set_new_username(user, new_username):
    if user_model.filter(username=new_username):
        return False
    user.username = new_username
    user.save()
    return True

def get_user_profile_data(user):
    user_profile = user_profile_info_model.get(user_id=user.id)
    image_url = get_image_url(user_profile)
    username = user.username
    user_profile_data = {
        "id": user.id,
    	"username": username,
    	"bio": user_profile.bio,
    	"image_url": image_url,
    	"total_games": user_profile.total_games,
    	"victories": user_profile.victories,
    	"defeats": user_profile.defeats,
    	"win_rate": user_profile.win_rate,
    	"tournaments_won": user_profile.tournaments_won,
    	"tournaments_lost": user_profile.tournaments_lost,
    	"tournaments_played": user_profile.tournaments_played,
    	"tournaments_win_rate": user_profile.tournaments_win_rate,
        "online": True if user_profile.online else False
    }
    return user_profile_data
