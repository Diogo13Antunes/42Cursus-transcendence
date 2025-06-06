from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required, check_request_body
from django.http import JsonResponse
from user_auth.models import User
from .models import TournamentRequests, Tournament, TournamentPlayers
from django.views import View
import json

from friendships.friendships import is_already_friend

tournament_requests_model = ModelManager(TournamentRequests)
tournament_player_model = ModelManager(TournamentPlayers)
tournament_model = ModelManager(Tournament)
user_model = ModelManager(User)

from .utils import has_active_tournament
from .utils import get_tournament_list
from .utils import update_tournament_status
from .utils import add_player_to_tournament
from .utils import invalidate_active_tournament_invites
from .utils import is_valid_tournament_name
from .utils import get_tournament_info
from .utils import send_games_notifications

from .consts import TOURNAMENT_STATUS_ABORTED
from .consts import TOURNAMENT_STATUS_ACTIVE
from .consts import TOURNAMENT_STATUS_CREATED

class TournamentView(View):

	@method_decorator(login_required)
	def get(self, request):
		username = request.GET.get('username')
		if username:
			user = user_model.get(username=username)
		else:
			user = user_model.get(id=request.access_data.sub)
		if user:
			tournaments_list = get_tournament_list(user=user)
			return JsonResponse({"message": f"Tournament list retrieved with success.", "tournaments_list": tournaments_list}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)

	@method_decorator(login_required)
	@method_decorator(check_request_body())
	def post(self, request):
		user = user_model.get(id=request.access_data.sub)
		if user:
			if has_active_tournament(user):
				return JsonResponse({"message": f"Error: User has already an active Tournament.",}, status=409)
			new_tournament_name = f'Tournament of {user.username}'
			new_tournament = tournament_model.create(name=new_tournament_name, owner=user)
			if not new_tournament:
				return JsonResponse({"message": f"Error: Failed to create Tournament.",}, status=409)
			if not add_player_to_tournament(new_tournament, user):
				new_tournament.delete()
				return JsonResponse({"message": f"Error: Failed to add player to Tournament.",}, status=409)
			tournament_info = get_tournament_info(new_tournament)
			return JsonResponse({"message": f"Tournament Created With Success!", "tournament_info": tournament_info}, status=201)
		else:
			return JsonResponse({"message": "Error: Invalid User, Requested Friend!"}, status=400)

	@method_decorator(login_required)
	def delete(self, request):
		user = user_model.get(id=request.access_data.sub)
		if not user:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)
		if not request.GET.get('id'):
			return JsonResponse({"message": "Error: Invalid request ID!"}, status=409)
		tournament_id = request.GET.get('id')
		if tournament_id:
			tournament = tournament_model.get(id=tournament_id)
			if tournament and tournament.owner == user:
				if tournament.status == TOURNAMENT_STATUS_CREATED:
					invalidate_active_tournament_invites(tournament)
				update_tournament_status(tournament=tournament, new_status=TOURNAMENT_STATUS_ABORTED)
				return JsonResponse({"message": f"Tournament {tournament_id} new status -> {tournament.status}"}, status=200)
		return JsonResponse({"message": "Error: Invalid Tournament ID!"}, status=409)

	@method_decorator(login_required)
	@method_decorator(check_request_body(["new_name", "id"]))
	def patch(self, request):
		if request.body:
			req_data = json.loads(request.body)
			if not "new_name" in req_data or not "id" in req_data:
				return JsonResponse({"message": "Error: Invalid request body!"}, status=400)
			user = user_model.get(id=request.access_data.sub)
			if not user:
				return JsonResponse({"message": "Error: Invalid User!"}, status=400)
			tournament = tournament_model.get(id=req_data["id"])
			new_tournament_name = req_data["new_name"].strip()
			if not tournament:
					return JsonResponse({"message": "Error: Invalid tournament ID!"}, status=409)
			if tournament.owner.id != user.id:
				return JsonResponse({"message": "Error: User is not the owner of the Tournament!"}, status=403)
			if new_tournament_name:
				if is_valid_tournament_name(new_tournament_name):
					tournament.name = new_tournament_name
					tournament.save()
					return JsonResponse({"message": "Tournament name changed with success!", "tournament_name": tournament.name}, status=200)
			return JsonResponse({"message": "Error: Invalid Tournament Name!", "tournament_name": tournament.name}, status=409)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
