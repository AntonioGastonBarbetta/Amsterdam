package com.martincastroandantoniobarbetta.amsterdam.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.fillMaxWidth

import androidx.compose.ui.unit.dp
import androidx.compose.material3.Icon
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.ui.Alignment

import androidx.compose.material.icons.filled.Done

import androidx.compose.material.icons.filled.Close

import androidx.compose.material3.TextField
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Text
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.ExperimentalComposeUiApi


import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.*
import androidx.compose.material.icons.filled.*
import androidx.compose.ui.text.input.ImeAction



@Composable
fun NoteDetailScreen(
    onClickBackToHome: () -> Unit,
) {
    var title by remember { mutableStateOf("") }
    var items by remember { mutableStateOf(listOf("")) }

    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            IconButton(onClick = onClickBackToHome) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
            }
            IconButton(onClick = { /* Manejar evento de clic en el botón de aceptar */ }) {
                Icon(Icons.Default.Done, contentDescription = "Done")
            }
            IconButton(onClick = { /* Manejar evento de clic en el botón de cancelar */ }) {
                Icon(Icons.Default.Close, contentDescription = "Cancel")
            }
        }

        // Input text 1
        TextField(
            value = title,
            onValueChange = { text -> title = text },
            modifier = Modifier
                .padding(top = 10.dp, bottom = 10.dp)
                .height(56.dp)
                .fillMaxWidth(),
            placeholder = { Text("Title") }
        )

        // Lista de CheckBox y TextField
        items.forEachIndexed { index, item ->
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 10.dp)
            ) {
                var checked by remember { mutableStateOf(false) }
                var text by remember { mutableStateOf(item) }

                Checkbox(
                    checked = checked,
                    onCheckedChange = { checked = it }
                )
                TextField(
                    value = text,
                    onValueChange = { newText ->
                        text = newText
                        items = items.toMutableList().apply {
                            set(index, newText)
                        }
                    },
                    modifier = Modifier
                        .weight(1f)
                        .padding(start = 8.dp),
                    placeholder = { Text("Task") },
                    keyboardOptions = KeyboardOptions.Default.copy(
                        imeAction = ImeAction.Done
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = {
                            if (text.isNotEmpty()) {
                                items = items + ""
                            }
                        }
                    )
                )
            }
        }
    }
}
