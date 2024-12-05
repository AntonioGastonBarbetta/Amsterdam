package com.martincastroandantoniobarbetta.amsterdam.ui.components

import NoteItem
import SharedViewModel
import android.annotation.SuppressLint
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun NoteDetailScreen(
    sharedViewModel: SharedViewModel,
    onClickBackToHome: () -> Unit,

) {
    var items by remember { mutableStateOf(listOf(NoteItem(text = "", isChecked = false))) }


    fun onClickDone (title: String)  {
        sharedViewModel.addNote(title = title, items = items.toMutableList())
        onClickBackToHome()
    }

    fun onItemModify(index: Int, isChecked: Boolean? = null, newText: String? = null) {
        items = items.toMutableList().apply {
            this[index] = this[index].copy(
                isChecked = isChecked ?: this[index].isChecked, // Si isChecked es null, conserva el valor actual
                text = newText ?: this[index].text // Si newText es null, conserva el valor actual
            )
        }
    }


    fun addNewItem(text: String, position: Int) {
        if (text.isNotEmpty() && position == items.size - 1) {
            items = items + NoteItem(text = "", isChecked = false)
        }
    }

    Scaffold { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            NoteDetailHeader(
                onClickBackToHome = onClickBackToHome,
                onClickIsDone = ::onClickDone
            )
            NoteDetailTaskList(
                items = items,
                onItemModified = ::onItemModify,
                addNewItem = ::addNewItem
            )
        }
    }
}
