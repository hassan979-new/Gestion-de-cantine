package ma.fst.enscantine.session;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {

    private SharedPreferences prefs;
    private static final String TOKEN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3NzcwNzUwMzIsImV4cCI6MTc3NzE2MTQzMn0.0-mZYTO8AQrRtenyrcSL7MufGy8lU0PRXbcqkAIKVbo";
    private static final String USER_ID_KEY = "user_id";

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences("app", Context.MODE_PRIVATE);
    }

    public void saveToken(String token) {
        prefs.edit().putString(TOKEN_KEY, token).apply();
    }

    public String getToken() {
        return prefs.getString(TOKEN_KEY, null);
    }

    public void saveUserId(int id) {
        prefs.edit().putInt(USER_ID_KEY, id).apply();
    }

    public int getUserId() {
        return prefs.getInt(USER_ID_KEY, -1);
    }

    public void clear() {
        prefs.edit().clear().apply();
    }

    private static final String EMAIL_KEY = "user_email";

    public void saveEmail(String email) {
        prefs.edit().putString(EMAIL_KEY, email).apply();
    }

    public String getEmail() {
        return prefs.getString(EMAIL_KEY, "");
    }
}
