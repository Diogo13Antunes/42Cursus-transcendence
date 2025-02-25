from django.http import HttpResponse
from transcendence.settings import ALLOWED_HOSTS, ALLOWED_PORT

# Configurations of cors headers
origin_name = "Access-Control-Allow-Origin"

headers_name = "Access-Control-Allow-Headers"
headers_data = [
	"Content-Type",
	'X-CSRFToken',
]

methods_name = "Access-Control-Allow-Methods"
methods_data = [
	"GET",
	"POST",
	"PATCH",
	"UPDATE",
	"PUT",
	"DELETE",
]

credentials_name = "Access-Control-Allow-Credentials"
credentials_data = [
	"true"
]

class CorsMiddleware:

	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		if request.method == "OPTIONS":
			response = HttpResponse()
			self.process_response(response, request)
			return response
		return self.process_response(self.get_response(request), request)

	def process_response(self, response, request):
		origin = request.headers.get("Origin")
		origin_data = self.__get_allowed_origins()
		if origin in origin_data:
			self.add_new_header(response, origin_name, [origin])
			self.add_new_header(response, headers_name, headers_data)
			self.add_new_header(response, methods_name, methods_data)
			self.add_new_header(response, credentials_name, credentials_data)
		return response

	def add_new_header(self, response, name, data):
		response[name] = ", ".join(data)

	# ALLOWED_HOSTS and ALLOWED_PORT are defined in transcendence/settings.py
	def __get_allowed_origins(self):
		origins = []
		if ALLOWED_HOSTS:
			for origin in ALLOWED_HOSTS:
				origins.append(f"https://{origin}:{ALLOWED_PORT}")
		else:
			origins = [
				"https://127.0.0.1:8080",
				"https://localhost:8080"
			]
		return origins
