package ma.fst.enscantine.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.MutableLiveData;

import ma.fst.enscantine.R;
import ma.fst.enscantine.entities.LoginResponse;
import ma.fst.enscantine.repository.AuthRepository;
import ma.fst.enscantine.session.SessionManager;

import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.button.MaterialButton;

public class LoginActivity extends AppCompatActivity {

    TextInputEditText emailInput, passwordInput;
    MaterialButton loginBtn;

    AuthRepository repo;
    SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        loginBtn = findViewById(R.id.loginBtn);

        session = new SessionManager(this);
        repo = new AuthRepository(session);

        loginBtn.setOnClickListener(v -> loginUser());

        TextView goToRegister = findViewById(R.id.goToRegister);
        goToRegister.setOnClickListener(v -> {
            startActivity(new Intent(this, RegisterActivity.class));
            finish();
        });
    }

    private void loginUser() {
        String email = emailInput.getText() != null ? emailInput.getText().toString().trim() : "";
        String password = passwordInput.getText() != null ? passwordInput.getText().toString() : "";

        // Basic validation
        if (email.isEmpty()) {
            emailInput.setError("Veuillez saisir votre email");
            emailInput.requestFocus();
            return;
        }
        if (password.isEmpty()) {
            passwordInput.setError("Veuillez saisir votre mot de passe");
            passwordInput.requestFocus();
            return;
        }

        loginBtn.setEnabled(false);
        loginBtn.setText("Connexion...");

        MutableLiveData<LoginResponse> result = new MutableLiveData<>();
        repo.login(email, password, result);

        result.observe(this, response -> {
            loginBtn.setEnabled(true);
            loginBtn.setText("Se connecter");

            if (response != null && response.token != null) {
                session.saveToken(response.token);
                session.saveUserId(response.user.id);
                session.saveEmail(email);
                Toast.makeText(this, "Connexion réussie !", Toast.LENGTH_SHORT).show();
                startActivity(new Intent(LoginActivity.this, HomeActivity.class));
                finish();
            } else {
                Toast.makeText(this, "Email ou mot de passe incorrect", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
