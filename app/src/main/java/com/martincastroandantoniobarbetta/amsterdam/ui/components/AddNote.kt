import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.fillMaxHeight

import androidx.compose.ui.unit.dp
import androidx.compose.material3.Icon
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.ui.Alignment

import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Done

import androidx.compose.material.icons.filled.Close

import androidx.compose.material3.TextField
import androidx.compose.material3.Text
import androidx.compose.material3.IconButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.ExperimentalComposeUiApi

@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun AddNote() {
    Column(
        modifier = Modifier.padding(16.dp)
    ) {
        // Barra superior
        // Barra superior
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            IconButton(onClick = { /* Manejar evento de clic en el botón de retroceso */ }) {
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
            value = "",
            onValueChange = { /* Manejar cambios en el texto */ },
            modifier = Modifier
                .padding(top = 10.dp, bottom = 10.dp)
                .height(56.dp)
                .fillMaxWidth(),
            placeholder = { Text("Title") }
        )

        // Input text 2
        TextField(
            value = "",
            onValueChange = { /* Manejar cambios en el texto */ },
            modifier = Modifier
                .padding(top = 10.dp)
                .fillMaxWidth()
                .fillMaxHeight(),
            placeholder = { Text("Description") }
        )
    }
}
