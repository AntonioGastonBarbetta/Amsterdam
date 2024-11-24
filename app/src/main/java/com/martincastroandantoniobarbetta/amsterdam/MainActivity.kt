package com.martincastroandantoniobarbetta.amsterdam

import SharedViewModel
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.rememberNavController
import com.martincastroandantoniobarbetta.amsterdam.ui.theme.AmsterdamTheme


import com.martincastroandantoniobarbetta.amsterdam.ui.navigation.MainNavHost


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AmsterdamTheme {
                val navController = rememberNavController()
                val sharedViewModel: SharedViewModel = viewModel()
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainNavHost(navController = navController,  sharedViewModel = sharedViewModel)
                }
            }
        }
    }
}










