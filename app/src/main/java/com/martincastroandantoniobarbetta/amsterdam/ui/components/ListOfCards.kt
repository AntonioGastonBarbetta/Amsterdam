import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ListOfCards (
    modifier: Modifier = Modifier
        .verticalScroll(rememberScrollState())
) {
    Column(
        modifier = modifier
            .padding(top = 10.dp, start = 16.dp, end = 16.dp)
    ) {
        repeat(8) { CardItemList() }
    }
}