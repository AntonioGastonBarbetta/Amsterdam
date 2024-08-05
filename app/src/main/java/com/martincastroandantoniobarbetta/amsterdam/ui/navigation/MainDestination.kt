package com.martincastroandantoniobarbetta.amsterdam.ui.navigation

sealed interface MainDestination {
    val route: String
}

object Home: MainDestination {
    override val route = "home"
}

object NoteDetail: MainDestination {
    override val route =  "addNote"
}

val mainScreens = listOf(Home, NoteDetail)