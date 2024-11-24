package com.martincastroandantoniobarbetta.amsterdam.ui.components

import ListOfCards
import SearchBar
import AddElementButton
import SharedViewModel
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
    sharedViewModel: SharedViewModel,
    onClick: () -> Unit = {},
) {
    val notes = sharedViewModel.notes

    Box(
        modifier = modifier.fillMaxSize() // Ensure the Box fills the entire screen
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            SearchBar()
            ListOfCards(notes = notes)
        }

        FloatingActionButton(
            onClick = onClick,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(16.dp) // Add padding to avoid edge clipping
        ) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = null
            )
        }
    }
}
