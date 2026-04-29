package ma.fst.enscantine.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;

import ma.fst.enscantine.R;
import ma.fst.enscantine.session.SessionManager;

public class ProfileActivity extends AppCompatActivity {

    SessionManager session;
    TextView txtAvatar, txtEmail, txtUserId;
    MaterialButton btnLogout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        session     = new SessionManager(this);
        txtAvatar   = findViewById(R.id.txtAvatar);
        txtEmail    = findViewById(R.id.txtEmail);
        txtUserId   = findViewById(R.id.txtUserId);
        btnLogout   = findViewById(R.id.btnLogout);

        String email = session.getEmail();
        int userId   = session.getUserId();

        if (email != null && !email.isEmpty()) {
            txtEmail.setText(email);

            txtAvatar.setText(String.valueOf(email.charAt(0)).toUpperCase());
        }

        txtUserId.setText("#" + userId);

        btnLogout.setOnClickListener(v -> confirmLogout());
    }

    private void confirmLogout() {
        new AlertDialog.Builder(this)
                .setTitle("Déconnexion")
                .setMessage("Voulez-vous vraiment vous déconnecter ?")
                .setPositiveButton("Oui", (d, w) -> logout())
                .setNegativeButton("Annuler", null)
                .show();
    }

    private void logout() {
        session.clear();
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}