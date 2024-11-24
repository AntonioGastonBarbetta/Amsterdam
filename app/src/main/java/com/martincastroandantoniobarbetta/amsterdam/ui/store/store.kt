import androidx.compose.runtime.mutableStateListOf
import androidx.lifecycle.ViewModel


data class Note(
    val id: Int,
    val title: String,
    val items: MutableList<NoteItem> = mutableListOf()
)

data class NoteItem(
    var text: String,
    var isChecked: Boolean
)


class SharedViewModel : ViewModel() {
    var notes = mutableStateListOf<Note>()

    fun addNote(title: String, items: MutableList<NoteItem>) {
        val newNote = Note(
            id = notes.size + 1,
            title = title,
            items = items
        )
        notes.add(newNote)
    }

    fun updateNoteItem(noteUpdated: Note) {
        val index = notes.indexOfFirst { it.id == noteUpdated.id }
        if (index != -1) {
            notes[index] = noteUpdated
        }
    }
}
