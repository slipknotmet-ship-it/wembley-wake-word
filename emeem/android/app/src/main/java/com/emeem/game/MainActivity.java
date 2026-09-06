package com.emeem.game;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

/**
 * Emeem's host activity.
 *
 * Two things matter here and neither is Capacitor's default:
 *   1. Immersive-sticky fullscreen, so the system bars do not sit on top of the
 *      thumb controls and a stray swipe near the edge does not pull up the nav
 *      bar mid-run. Android drops out of immersive mode on its own after some
 *      interactions, so it is re-applied on every focus gain.
 *   2. FLAG_KEEP_SCREEN_ON, because the game takes no touch input during a long
 *      run down an empty corridor and Android would otherwise dim the display.
 */
public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        applyImmersiveMode();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) applyImmersiveMode();
    }

    private void applyImmersiveMode() {
        View decor = getWindow().getDecorView();
        WindowInsetsControllerCompat controller =
                WindowCompat.getInsetsController(getWindow(), decor);
        controller.hide(WindowInsetsCompat.Type.systemBars());
        controller.setSystemBarsBehavior(
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }
}
