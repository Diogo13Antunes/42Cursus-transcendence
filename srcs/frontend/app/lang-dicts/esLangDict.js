export const esAppChatDict = {
	/* HTML */
	no_friends_msg: "No se han añadido amigos.",
	find_friends_msg: "¡Haz clic aquí para hacer amigos!",
	no_friend_selected: "No se ha seleccionado ningún amigo. Selecciona un amigo para comenzar a hablar.",

	/* stateManager.setState("errorMsg */
	error_msg: "Error: Error: El usuario al que intentaste enviar un mensaje ya no es tu amigo",
}

export const esAppConfigs = {
	/* HTML */
	profile_settings_header: "Configuración del Perfil",
	new_username_label: "Cambiar Nombre de Usuario",
	new_username_placeholder: "Nuevo Nombre de Usuario",
	new_bio_label: "Cambiar Biografía",
	new_bio_placeholder: "Nueva Biografía",
	security_settings_header: "Configuración de Seguridad",
	security_settings_legend: "Elige dónde recibir tu autenticación de dos factores:",
	show_qrcode: "Mostrar QR Code",
	security_phone_label: "Teléfono",
	game_settings_header: "Configuración del Juego",
	game_theme_label: "Elige el tema del juego:",
	language_settings_header: "Configuración de Idioma",
	language_label: "Elige idioma:",
	apply_changes_button: "Aplicar Cambios",
	upload_image_button: "Subir Imagen",
	new_avatar_button: "Nuevo Avatar",
	apply_changes_button: "Aplicar Cambios",

	/* connectedCallback */
	success: "Configuraciones de usuario actualizadas con éxito",
	username_invalid: "¡Nombre de usuario inválido!",
	image_size: "El tamaño de la imagen no debe exceder",
	image_type: "Solo se aceptan los siguientes formatos:",
	invalid_phone: "¡Número de teléfono inválido!",
	unexpected_error: "¡Error inesperado!",

	/* stateManager.setState("errorMsg */
	error_msg: "Error: no se pudo obtener el código QR",
}

export const esAppFriendsDict = {
	/* HTML */
	search_button: "Buscar",
	all_friends_button: "Todos los amigos",
	requests_button: "Solicitudes",
	search_bar_placeholder_search: "Buscar amigos...",

	/* #createSearchPage() */
	no_users_to_search: "¡No hay usuarios para buscar!",

	/* #createFriendsPage() */
	create_friends_no_friends: "Tu lista de amigos está vacía.",

	/* #createRequestsPage() */
	create_requests_no_requests: "No tienes solicitudes de amistad.",
	
	/* #search(type, value) */
	username_not_found: "¡Nombre de usuario no encontrado!"
}

export const esAppLobbyDict = {
	/* HTML */
	ready_button: "Listo",

	/* #updatePlayer(playerInfo, playerType) */
	ready_status: "Listo",
	not_ready_status: "No Listo",

	/* stateManager.setState("errorMsg */
	error_msg1: "El juego ya no existe",
	error_msg2: "Todos los jugadores rechazarán tu invitación",
}

export const esAppPlayDict = {
	/* HTML */
	leave_button: "Salir",
}

export const esChatFriendListDict = {
	/* HTML */
	search_bar_placeholder_search: "Buscar usuarios..."
}

export const esChatSectionDict = {
	/* HTML */
	message_placeholder: "Mensaje...",

	/* #getTimeDate(timestamp) */
	today_timestamp: "Hoy",
	yesterday_timestamp: "Ayer",
}

export const esGameHistory = {
	/* HTML */
	solo_games_button: "Juegos en Solitario",
	tournament_games: "Juegos de Torneo",
	victory_color: "Victoria",
	defeat_color: "Derrota",

	/* #insertGames(gameList) */
	no_games_played: "No se han jugado juegos aún.",

	/* #insertTournaments(tournamentList) */
	no_tournaments_played: "No se han jugado torneos aún.",
}

export const esGameInviteCardDict = {
	/* HTML */
	join_button: "Unirse"
}

export const esGameInviteRequestDict = {
	/* HTML */
	game_invites: "Invitaciones a Juegos",

	/* stateManager.setState("errorMsg */
	error_msg: "La invitación ha expirado",
}

export const esGameInviteSendDict = {
	/* HTML */
	search_bar_placeholder_search: "Buscar amigos...",
	invite_button: "Invitar",

	/* stateManager.setState("errorMsg */
	error_msg: "No se pudo enviar la invitación",
}

export const esPageChatDict = {
	title: "BlitzPong - Chat"
}

export const esPageConfigsDict = {
	title: "BlitzPong - Configuraciones"
}

export const esPageFriendsDict = {
	title: "BlitzPong - Amigos"
}

export const esPageHomeDict = {
	title: "BlitzPong - Inicio"
}

export const esPagePlayDict = {
	title: "BlitzPong - Jugar",
	/* HTML */
	invite_button: "Invitar a Juego"
}

export const esPageTournamentInfoDict = {
	title: "BlitzPong - Información del Torneo",
}

export const esPageTournamentsDict = {
	title: "BlitzPong - Torneo",
	/* HTML */
	create_tournament_button: "Crear Torneo",
	exit_tournament_button: "Salir del Torneo"
}

export const esSidePanelDict = {
	/* HTML */
	home: "Inicio",
	chat: "Chat",
	tournaments: "Torneos",
	friends: "Amigos",
	play: "Jugar",
	logout: "Cerrar Sesión",
	logout_popup_msg: "Cerrar sesión de BlitzPong",
	logout_popup_close: "Cerrar",
	logout_popup_logout: "Cerrar Sesión",
	configurations: "Configuraciones"
}

export const esTournamentCardDict = {
	/* HTML */
	see_more_info_button: "Más Información",
}

export const esTourneyGraphDict = {
	/* HTML */
	tournament_winner: "GANADOR",
	start_game_button: "Iniciar Juego",
}

export const esTourneyInviteCardDict = {
	/* HTML */
	join_button: "Unirse"
}

export const esTourneyInviterDict = {
	/* HTML */
	search_bar_placeholder_search: "Buscar amigos...",
	invite_button: "Invitar",
}

export const esTourneyInvitesReceivedDict = {
	/* HTML */
	tournaments_invites: "Invitaciones a Torneos"
}

export const esTourneyLobbyDict = {
	/* getHTML */
	start_button: "Iniciar",
	cancel_button: "Cancelar",
	leave_button: "Salir",
	update_name_button: "Cambiar Nombre",

	/* #setDefaultPhoto(elmHtml) */
	player_username_placeholder: "esperando...",

	/* stateManager.setState("errorMsg */
	error_msg1: "No fue posible cancelar el torneo",
	error_msg2: "No fue posible salir del torneo",
	error_msg3: "No fue posible iniciar el torneo",
	error_msg4: "No fue posible cambiar el nombre del torneo",
}

export const esUserProfile = {
	/* #updateStats(stats) */
	total_games: "Total de Juegos:",
	games_win_rate: "Porcentaje de Victorias",
	total_tournaments: "Total de Torneos:",
	tournaments_win_rate: "Porcentaje de Victorias de Torneos:",
}

export const esUserCardDict = {
	/* stateManager.setState("errorMsg */
	error_msg1: "Solicitud de amistad aceptada",
	error_msg2: "Solicitud de amistad expirada",
	error_msg3: "El usuario ya no es tu amigo",
}