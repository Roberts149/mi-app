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
          // En TV abre Just Player; en celular abre VLC
          boolean tv = getPackageManager().hasSystemFeature("android.software.leanback");
          String app = tv ? "com.brouken.player" : "org.videolan.vlc";
          String nombre = tv ? "Just Player" : "VLC";
          Intent i = new Intent(Intent.ACTION_VIEW);
          i.setDataAndType(Uri.parse(url), "video/*");
          i.setPackage(app);
          // Espera a que se libere la conexion antes de abrir el reproductor
          new Handler(Looper.getMainLooper()).postDelayed(() -> {
            try {
              startActivity(i);
            } catch (Exception e) {
              aviso("No se pudo abrir " + nombre + ". Revisa que este instalado.");
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
    new android.app.AlertDialog.Builder(this).setTitle("Aviso").setMessage(texto).setPositiveButton("OK", null).show();
  }
}
EOF

# Nuevo inicio
W=android/app/src/main/assets/public
cp inicio.js cascada.jpg "$W/"
sed -i 's#<script src="extras3.js"></script>#&<script src="inicio.js"></script>#' "$W/index.html"
grep -q 'inicio.js' "$W/index.html"
