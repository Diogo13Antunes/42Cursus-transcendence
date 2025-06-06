from custom_decorators import accepted_methods, login_required, tfa_required, check_request_body
from custom_utils.models_utils import ModelManager
from django.http import JsonResponse
from .models import OtpUserOptions
from user_auth.models import User
import json

from .two_factor import generate_qr_code_img_base64
from .two_factor import send_smsto_user
from .two_factor import send_email_to_user
from .two_factor import is_valid_otp
from .two_factor import is_valid_otp_qr_code
from .two_factor import exist_qr_code
from .two_factor import exist_email
from .two_factor import exist_phone_number
from .two_factor import is_valid_input_code
from .two_factor import is_valid_otp_method
from .two_factor import get_new_code_wait_time
from .two_factor import initiate_two_factor_authentication
from .two_factor import reset_wait_time_codes
from user_auth.auth_utils import login as user_login

from django.views.decorators.csrf import csrf_exempt

from transcendence.settings import DEBUG

otp_user_settings_model = ModelManager(OtpUserOptions)
user_model = ModelManager(User)

@tfa_required
@accepted_methods(["GET"])
def configured_2fa(request):
	if request:
		if request.tfa_data:
			user = user_model.get(id=request.tfa_data.sub)
			if not user:
				return JsonResponse({"message": "Error: Invalid Users!"}, status=409)
			otp_user_settings = otp_user_settings_model.get(user=user)
			if not otp_user_settings:
				return JsonResponse({"message": "Error: User has no OTP setup!"}, status=409)
			configured_methods = {"qr_code": False, "email": False, "phone": False}
			if exist_qr_code(user):
				configured_methods['qr_code'] = True
			if exist_email(user):
				configured_methods['email'] = True
			if exist_phone_number(user):
				configured_methods['phone'] = True
			otp_method = initiate_two_factor_authentication(user)
			return JsonResponse({
					"message": "OTP option sended with success!",
					"configured_methods": configured_methods,
					"method": otp_method
				}, status=200)
	return JsonResponse({"message": "Error: Invalid Request!"}, status=400)

@login_required
@accepted_methods(["POST"])
@check_request_body()
def generate_qr_code(request):
	if request:
		if request.access_data:
			user = user_model.get(id=request.access_data.sub)
			if not user:
				return JsonResponse({"message": "Error: Invalid Users!"}, status=409)
			if not exist_qr_code(user):
				return JsonResponse({"message": "Error: QR Code is not configured in 2FA!"}, status=409)
			qr_code = generate_qr_code_img_base64(user)
			if not qr_code:
				return JsonResponse({"message": "Error: Failed to generate 2FA QR Code!"}, status=409)
			return JsonResponse({"message": "QR Code sended with success!", "qr_code": qr_code}, status=200)
	return JsonResponse({"message": "Error: Invalid Request!"}, status=400)

@csrf_exempt
@tfa_required
@accepted_methods(["POST"])
@check_request_body()
def generate_user_phone_code(request):
	if request:
		if request.tfa_data:
			user = user_model.get(id=request.tfa_data.sub)
			if not user:
				return JsonResponse({"message": "Error: Invalid Users!"}, status=409)
			if not exist_phone_number(user):
				return JsonResponse({"message": "Error: Phone Number is not configured in 2FA!"}, status=409)
			wait_time = get_new_code_wait_time(user)
			if wait_time:
				return JsonResponse({"message": f"Error: Wait {wait_time} to send a new code. Please check your Mobile Phone."}, status=409)
			if not send_smsto_user(user):
				return JsonResponse({"message": "Error: Failed to send 2FA SMS!"}, status=409)
			return JsonResponse({"message": "SMS sended with success!"}, status=200)
	return JsonResponse({"message": "Error: Invalid Request!"}, status=400)

@csrf_exempt
@tfa_required
@accepted_methods(["POST"])
@check_request_body()
def generate_user_email_code(request):
	if request:
		if request.tfa_data:
			user = user_model.get(id=request.tfa_data.sub)
			if not user:
				return JsonResponse({"message": "Error: Invalid Users!"}, status=409)
			if not exist_email(user):
				return JsonResponse({"message": "Error: Email is not configured in 2FA!"}, status=409)
			wait_time = get_new_code_wait_time(user)
			if wait_time:
				return JsonResponse({"message": f"Error: Wait {wait_time} to send a new code. Please check your mail box."}, status=409)
			if not send_email_to_user(user):
				return JsonResponse({"message": "Error: Failed to send 2FA email!"}, status=409)
			return JsonResponse({"message": "Email sended with success!"}, status=200)
	return JsonResponse({"message": "Error: Invalid Request!"}, status=400)

@csrf_exempt
@tfa_required
@accepted_methods(["POST"])
@check_request_body(["code", "method"])
def validateOTP(request):
	if request:
		if request.tfa_data:
			if not request.body:
				return JsonResponse({"message": "Error: Empty Body Request!"}, status=400)
			user = user_model.get(id=request.tfa_data.sub)
			if not user:
				return JsonResponse({"message": "Error: Invalid Users!"}, status=409)
			body_unicode = request.body.decode('utf-8')
			req_data = json.loads(body_unicode)
			if not is_valid_input_code(req_data.get('code')):
				return JsonResponse({"message": "Error: Invalid OTP Code!"}, status=409)
			if not DEBUG:
				code = str(req_data['code'])
				if not is_valid_otp_method(req_data.get('method')):
					return JsonResponse({"message": "Error: Invalid OTP Method!"}, status=409)
				tfa_method = str(req_data['method'])
				is_valid_otp_status = False
				if tfa_method == "email" or tfa_method == "phone":
					if is_valid_otp(code, user):
						is_valid_otp_status = True
				else:
					if is_valid_otp_qr_code(code, user):
						is_valid_otp_status = True
				if not is_valid_otp_status:
					return JsonResponse({"message": "Invalid Submited Code!"}, status=409)
			reset_wait_time_codes(user)
			response = user_login(JsonResponse({"message": "OTP validated with success!"}, status=200), user)
			response.delete_cookie('two_factor_auth', path="/api/two-factor-auth")
			return response
	return JsonResponse({"message": "Error: Invalid Request!"}, status=400)
