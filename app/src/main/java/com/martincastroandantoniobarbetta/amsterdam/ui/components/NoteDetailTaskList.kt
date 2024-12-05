package com.martincastroandantoniobarbetta.amsterdam.ui.components

import NoteItem
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.platform.LocalSoftwareKeyboardController


@Composable
fun NoteDetailTaskList(
    items: List<NoteItem>,
    onItemModified: (index: Int, isChecked: Boolean?, newText: String?) -> Unit,
    addNewItem : (text: String, position: Int) -> Unit

    ) {
    val keyboardController = LocalSoftwareKeyboardController.current
    val lastFocusRequester = remember { FocusRequester() }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 8.dp)
    ) {
        itemsIndexed(items) { index, item ->
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp, horizontal = 16.dp)
            ) {
                var text by remember { mutableStateOf(item.text) }
                var checked by remember { mutableStateOf(item.isChecked) }

                Checkbox(
                    checked = checked,
                    onCheckedChange = { isChecked ->
                        checked = isChecked
                        onItemModified(index, isChecked, null) // Se pasa isChecked, newText es null
                    }
                )
                TextField(
                    value = text,
                    onValueChange = { newText ->
                        text = newText
                        onItemModified(index, null, newText) // Se pasa newText, isChecked es null
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(start = 8.dp)
                        .focusRequester(if (index == items.size - 1) lastFocusRequester else FocusRequester()),
                    placeholder = { Text("Task") },
                    keyboardOptions = KeyboardOptions.Default.copy(
                        imeAction = ImeAction.Done
                    ),
                    keyboardActions = KeyboardActions(
                        onDone = {
                            addNewItem(text, index)
                            lastFocusRequester.requestFocus()
                            keyboardController?.show()
                        }
                    )
                )
            }
        }
    }

    LaunchedEffect(items.size) {
        if (items.last().text.isEmpty()) {
            lastFocusRequester.requestFocus()
            keyboardController?.show()
        }
    }
}
