from django.urls import re_path
from . import consumers

game_urls = [
	re_path(r'game/(?P<lobby_id>\d+)/$', consumers.Game.as_asgi()),
	re_path(r'tournament-game/(?P<lobby_id>\d+)/$', consumers.Game.as_asgi()),
]
