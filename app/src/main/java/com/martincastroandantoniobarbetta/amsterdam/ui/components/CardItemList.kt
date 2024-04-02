import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp

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