package com.martincastroandantoniobarbetta.amsterdam.ui.navigation
import SharedViewModel
import androidx.compose.runtime.Composable
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.NavHostController
import androidx.navigation.compose.composable
import com.martincastroandantoniobarbetta.amsterdam.ui.components.HomeScreen
import com.martincastroandantoniobarbetta.amsterdam.ui.components.NoteDetailScreen


@Composable
fun MainNavHost(
        navController: NavHostController,
        sharedViewModel: SharedViewModel
) {
    NavHost(
        navController = navController,
        startDestination = Home.route,
    ) {
        composable(route = Home.route) {
            HomeScreen (sharedViewModel = sharedViewModel) {navController.navigate(NoteDetail.route)}
        }

        composable(route = NoteDetail.route)  {
            NoteDetailScreen (sharedViewModel = sharedViewModel) { navController.navigate(Home.route) }
        }
    }
}



