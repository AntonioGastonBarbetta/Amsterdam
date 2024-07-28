package com.martincastroandantoniobarbetta.amsterdam.ui.navigation
import androidx.compose.runtime.Composable
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.NavHostController
import androidx.navigation.compose.composable
import com.martincastroandantoniobarbetta.amsterdam.ui.components.HomeScreen
import com.martincastroandantoniobarbetta.amsterdam.ui.components.NoteDetailScreen

import com.martincastroandantoniobarbetta.amsterdam.ui.navigation.MainDestination.Home
import com.martincastroandantoniobarbetta.amsterdam.ui.navigation.MainDestination.NoteDetail


@Composable
fun MainNavHost(
        navController: NavHostController
) {
    NavHost(
        navController = navController,
        startDestination = Home.route,
    ) {
        composable(route = Home.route) {
            HomeScreen()
        }

        composable(route = NoteDetail.route)  {
            NoteDetailScreen()
        }
    }
}


fun NavHostController.navigateSingleTopTo(route: String) =
    this.navigate(route) {
        popUpTo(
            this@navigateSingleTopTo.graph.findStartDestination().id
        ) {
            saveState = true
        }
        launchSingleTop = true
        restoreState = true
    }

