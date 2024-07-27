package com.martincastroandantoniobarbetta.amsterdam.ui.components

import ListOfCards
import SearchBar
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
) {
    Column (modifier = modifier

    ){
        SearchBar()
        ListOfCards()
    }
}
