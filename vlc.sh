set -e
J=$(find android/app/src/main/java -name MainActivity.java)
P=$(grep '^package' "$J")
cat > "$J" <<EOF
$P
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle state) {
    super.onCreate(state);
    getBridge().getWebView().addJavascriptInterface(new Object() {
      @JavascriptInterface
      public boolean abrir(String url) {
        try {
          Intent i = new Intent(Intent.ACTION_VIEW);
          i.setPackage("org.videolan.vlc");
          i.setDataAndType(Uri.parse(url), "video/*");
          startActivity(i);
          return true;
        } catch (Exception e) {
          return false;
        }
      }
    }, "MrcVlc");
  }
}
EOF
