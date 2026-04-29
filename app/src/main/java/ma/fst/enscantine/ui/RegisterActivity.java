package ma.fst.enscantine.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.MutableLiveData;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

import ma.fst.enscantine.R;
import ma.fst.enscantine.entities.LoginResponse;
import ma.fst.enscantine.repository.AuthRepository;
import ma.fst.enscantine.session.SessionManager;

public class RegisterActivity extends AppCompatActivity {

    TextInputEditText emailInput, passwordInput, passwordConfirmInput;
    MaterialButton registerBtn;
    TextView goToLogin;

    AuthRepository repo;
    SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        emailInput          = findViewById(R.id.registerEmail);
        passwordInput       = findViewById(R.id.registerPassword);
        passwordConfirmInput = findViewById(R.id.registerPasswordConfirm);
        registerBtn         = findViewById(R.id.registerBtn);
        goToLogin           = findViewById(R.id.goToLogin);

        session = new SessionManager(this);
        repo    = new AuthRepository(session);

        registerBtn.setOnClickListener(v -> registerUser());

        goToLogin.setOnClickListener(v -> {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });
    }

    private void registerUser() {
        String email    = emailInput.getText() != null ? emailInput.getText().toString().trim() : "";
        String password = passwordInput.getText() != null ? passwordInput.getText().toString() : "";
        String confirm  = passwordConfirmInput.getText() != null ? passwordConfirmInput.getText().toString() : "";

        if (email.isEmpty()) {
            emailInput.setError("Veuillez saisir votre email");
            emailInput.requestFocus();
            return;
        }
        if (password.isEmpty()) {
            passwordInput.setError("Veuillez saisir un mot de passe");
            passwordInput.requestFocus();
            return;
        }
        if (password.length() < 6) {
            passwordInput.setError("Minimum 6 caractères");
            passwordInput.requestFocus();
            return;
        }
        if (!password.equals(confirm)) {
            passwordConfirmInput.setError("Les mots de passe ne correspondent pas");
            passwordConfirmInput.requestFocus();
            return;
        }

        registerBtn.setEnabled(false);
        registerBtn.setText("Création...");

        MutableLiveData<LoginResponse> result = new MutableLiveData<>();
        repo.register(email, password, result);

        result.observe(this, response -> {
            registerBtn.setEnabled(true);
            registerBtn.setText("Créer mon compte");

            if (response != null && response.token != null) {
                session.saveToken(response.token);
                session.saveUserId(response.user.id);
                session.saveEmail(email);
                Toast.makeText(this, "Compte créé !", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(this, HomeActivity.class));
                finish();
            } else {
                Toast.makeText(this, "Erreur lors de l'inscription", Toast.LENGTH_SHORT).show();
            }
        });
    }
}