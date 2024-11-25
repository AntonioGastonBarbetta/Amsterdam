package com.martincastroandantoniobarbetta.amsterdam.ui.components

import NoteItem
import SharedViewModel
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Done
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.Alignment
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.foundation.layout.LocalWindowInsets
@Composable
fun NoteDetailScreen(
    sharedViewModel: SharedViewModel,
    onClickBackToHome: () -> Unit,
) {
    var title by remember { mutableStateOf("") }
    var items by remember { mutableStateOf(listOf(NoteItem(text = "", isChecked = false))) }

    val scrollState = rememberScrollState()
    val focusManager = LocalFocusManager.current
    val lastFocusRequester = remember { FocusRequester() }

    // Obtener los insets del teclado
    val insets = LocalWindowInsets.current
    val imeHeight = with(LocalDensity.current) { insets.ime.bottom.toDp() }

    // FocusRequester para el título
    val titleFocusRequester = remember { FocusRequester() }

    // Enfocar automáticamente el título al ingresar a la pantalla
    LaunchedEffect(Unit) {
        titleFocusRequester.requestFocus()
    }

    Column(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxSize()
    ) {
        // Encabezado con los iconos
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp)
        ) {
            IconButton(onClick = onClickBackToHome) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
            }
            Spacer(modifier = Modifier.weight(1f))
            IconButton(onClick = {
                sharedViewModel.addNote(title = title, items = items.toMutableList())
                onClickBackToHome()
            }) {
                Icon(Icons.Default.Done, contentDescription = "Done")
            }
        }

        // Campo de título siempre visible y enfocado al ingresar
        TextField(
            value = title,
            onValueChange = { text -> title = text },
            modifier = Modifier
                .padding(top = 10.dp, bottom = 10.dp)
                .height(56.dp)
                .fillMaxWidth()
                .focusRequester(titleFocusRequester), // Aplicar el FocusRequester
            placeholder = { Text("Title") },
            keyboardOptions = KeyboardOptions.Default.copy(
                imeAction = ImeAction.Next
            ),
            keyboardActions = KeyboardActions(
                onDone = { /* No hacer nada para que el teclado no se cierre */ }
            )
        )

        // Lista de items, con desplazamiento controlado
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .verticalScroll(scrollState)
                .padding(bottom = imeHeight) // Ajustar el contenido cuando el teclado está visible
        ) {
            items.forEachIndexed { index, item ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 10.dp)
                ) {
                    var checked by remember { mutableStateOf(item.isChecked) }
                    var text by remember { mutableStateOf(item.text) }

                    val focusRequester = remember { FocusRequester() }

                    Checkbox(
                        checked = checked,
                        onCheckedChange = {
                            checked = it
                            items = items.toMutableList().apply {
                                this[index] = item.copy(isChecked = it)
                            }
                        }
                    )

                    TextField(
                        value = text,
                        onValueChange = { newText ->
                            text = newText
                            items = items.toMutableList().apply {
                                this[index] = item.copy(text = newText)
                            }
                        },
                        modifier = Modifier
                            .weight(1f)
                            .padding(start = 8.dp)
                            .focusRequester(if (index == items.size - 1) lastFocusRequester else focusRequester),
                        placeholder = { Text("Task") },
                        keyboardOptions = KeyboardOptions.Default.copy(
                            imeAction = ImeAction.Done
                        ),
                        keyboardActions = KeyboardActions(
                            onDone = {
                                if (text.isNotEmpty() && index == items.size - 1) {
                                    // Agregar un nuevo campo vacío
                                    items = items + NoteItem(text = "", isChecked = false)
                                    focusManager.clearFocus() // Esto ya no ocultará el teclado
                                }
                            }
                        )
                    )
                }
            }
        }
    }

    // Enfocar automáticamente el último campo cuando se agrega
    LaunchedEffect(items.size) {
        if (items.last().text.isEmpty()) {
            lastFocusRequester.requestFocus()
            scrollState.animateScrollTo(scrollState.maxValue)
        }
    }
}
