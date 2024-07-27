package com.martincastroandantoniobarbetta.amsterdam.navigation
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.NavHostController
import androidx.navigation.compose.composable

import com.martincastroandantoniobarbetta.amsterdam.navigation.MainDestination.Home
import com.martincastroandantoniobarbetta.amsterdam.navigation.MainDestination.NoteDetail

import com.martincastroandantoniobarbetta.amsterdam.ui.components.HomeScreen
import com.martincastroandantoniobarbetta.amsterdam.ui.components.NoteDetailScreen



@Composable
fun MainNavHost(
    navController: NavHostController,
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = navController,
        startDestination = Home.route,
        modifier = modifier
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

