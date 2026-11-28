set -e
J=$(find android/app/src/main/java -name MainActivity.java)
P=$(grep '^package' "$J")
cat > "$J" <<EOF
$P
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
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
          i.setClassName("org.videolan.vlc", "org.videolan.vlc.gui.video.VideoPlayerActivity");
          // Espera a que se libere la conexion antes de abrir VLC
          new Handler(Looper.getMainLooper()).postDelayed(() -> {
            try {
              startActivityForResult(i, 42);
            } catch (Exception directo) {
              aviso("No se pudo abrir VLC: " + directo.getMessage());
            }
          }, 2500);
          return true;
        } catch (Exception e) {
          return false;
        }
      }
    }, "MrcVlc");
  }

  private void aviso(String texto) {
    new android.app.AlertDialog.Builder(this).setTitle("Aviso de VLC").setMessage(texto).setPositiveButton("OK", null).show();
  }

  @Override
  protected void onActivityResult(int req, int res, Intent data) {
    super.onActivityResult(req, res, data);
    if (req != 42) return;
    long seg = data == null ? -1 : data.getLongExtra("extra_position", -1) / 1000;
    aviso("Codigo: " + res + "  Segundos vistos: " + seg);
  }
}
EOF

# Nuevo inicio
W=android/app/src/main/assets/public
cp inicio.js cascada.jpg "$W/"
sed -i 's#<script src="extras3.js"></script>#&<script src="inicio.js"></script>#' "$W/index.html"
grep -q 'inicio.js' "$W/index.html"
