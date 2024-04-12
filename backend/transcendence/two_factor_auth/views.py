from django.shortcuts import render
from .tfa_utils import *
from django.http import JsonResponse
import json
from custom_decorators import accepted_methods
import os

from custom_utils.models_utils import ModelManager

@accepted_methods(["POST"])
def generateOTP(request):
	print("---------------------------------------")
	otp_code = generate_otp_code()
	otp_exp_timestamp = generate_otp_expiration_timestamp()
	otp = add_otp_to_database(otp_code=otp_code, otp_exp_timestamp=otp_exp_timestamp)
	if otp:
		print(f"One Time Password: {otp}")
	print("---------------------------------------")

	message = {"message": f"One Time Password: {otp}"}
	return JsonResponse(message)

@accepted_methods(["POST"])
def validateOTP(request):

	if request.body:
		req_data = json.loads(request.body)
		otp_input_code = str(req_data['code']).strip()
		print(f"Input Code: {otp_input_code}")

		if otp_input_code:
			otp = exist_otp(otp_input_code)

			if otp:

				if is_valid_otp(otp):
					message = "Validated with Success"
				else:
					message = "The code is expired"
				
				delete_otp(otp)
				if not get_specific_otp_obj(otp_input_code):
					print("OTP deleted with success.")

			else:
				message = "The code does not exist"

		else:
			message = "Empty Input"

	print(message)
	response_msg = {"message": message}
	return JsonResponse(response_msg)

@accepted_methods(["GET"])
def printAllOtps(request):
	print("==========================================================")
	show_all_opts()
	print("==========================================================")
	message = {"message": f"function -> printAllOtps"}
	return JsonResponse(message)

@accepted_methods(["GET"])
def printValidOtps(request):
	print("==========================================================")
	show_valid_opts()
	print("==========================================================")
	message = {"message": f"function -> printValidOtps"}
	return JsonResponse(message)

@accepted_methods(["DELETE"])
def deleteAllInvalidOtps(request):
	print("==========================================================")
	print("Before deletion:")
	show_all_opts()
	delete_invalid_otps()
	print("After deletion:")
	show_all_opts()
	print("==========================================================")
	message = {"message": f"All invalid codes deleted from database."}
	return JsonResponse(message)
