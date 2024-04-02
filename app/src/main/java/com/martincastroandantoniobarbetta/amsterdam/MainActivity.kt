package com.martincastroandantoniobarbetta.amsterdam

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.martincastroandantoniobarbetta.amsterdam.ui.theme.AmsterdamTheme
import androidx.compose.ui.Alignment

//searchbar imports
import androidx.compose.foundation.layout.fillMaxWidth

import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Icon
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.ui.unit.dp

// add button imports
import androidx.compose.material3. FloatingActionButton
import androidx.compose.material.icons.filled.Add

// ElemenItemList imports
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Text
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll


class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AmsterdamTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    Main()
                    addElement()

                }
            }
        }
    }
}

@Composable
fun Main(
    modifier: Modifier = Modifier,
    ) {
    Column (modifier = modifier

    ){
        SearchBar()
        ListOfCards()
    }
}

@Composable
fun SearchBar(
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .heightIn(min = 56.dp)
    ) {
        TextField(
            value = "",
            onValueChange = {},
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = null
                )
            },

            placeholder = {
                Text(text = "Search")
            },
            modifier = Modifier.fillMaxWidth()
        )
    }
}


@Composable
fun ListOfCards (
    modifier: Modifier = Modifier
        .verticalScroll(rememberScrollState())
) {
    Column(
        modifier = modifier
            .padding(top = 10.dp, start = 16.dp, end = 16.dp)
    ) {
        CardItemList()
        CardItemList()
        CardItemList()
        CardItemList()
        CardItemList()
        CardItemList()
        CardItemList()
        CardItemList()
    }
}

@Composable
fun CardItemList(
    modifier: Modifier = Modifier

) {
    Box(
        modifier = modifier
    ) {
        ElevatedCard(
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.surface,
            ),
            modifier = Modifier
                .fillMaxWidth()
                .height(150.dp)
                .padding(top = 10.dp)
        ) {
            Text(
                text = "List one",
                modifier = Modifier
                    .padding(16.dp),
                textAlign = TextAlign.Center,
            )

            Text(
                text = "blalbalbalblablaba",
                modifier = Modifier
                    .padding(start = 16.dp, end = 16.dp, bottom = 3.dp),
                textAlign = TextAlign.Center,
            )
        }
    }
}



@Composable
fun addElement(
    modifier: Modifier = Modifier
        .padding(16.dp)
) {
    Box(
        modifier = modifier
            .heightIn(min = 30.dp)

    ) {
        FloatingActionButton(onClick = { },
            modifier = modifier
                .align(Alignment.BottomEnd)

        ) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = null
            )
        }
    }
}

