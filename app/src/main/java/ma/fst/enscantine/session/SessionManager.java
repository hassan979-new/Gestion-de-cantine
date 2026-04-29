package ma.fst.enscantine.session;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {

    private SharedPreferences prefs;
    private static final String TOKEN_KEY = "jwt_token";

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences("app", Context.MODE_PRIVATE);
    }

    public void saveToken(String token) {
        prefs.edit().putString(TOKEN_KEY, token).apply();
    }

    public String getToken() {
        return prefs.getString(TOKEN_KEY, null);
    }

    public void clear() {
        prefs.edit().clear().apply();
    }
}
