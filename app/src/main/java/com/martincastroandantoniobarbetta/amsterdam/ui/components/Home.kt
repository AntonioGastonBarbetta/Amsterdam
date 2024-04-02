import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import ListOfCards

@Composable
fun Home(
    modifier: Modifier = Modifier,
) {
    Column (modifier = modifier

    ){
        SearchBar()
        ListOfCards()
    }
}
