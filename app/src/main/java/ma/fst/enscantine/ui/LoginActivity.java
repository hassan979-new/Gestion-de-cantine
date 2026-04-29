package ma.fst.enscantine.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.MutableLiveData;

import ma.fst.enscantine.R;
import ma.fst.enscantine.entities.LoginResponse;
import ma.fst.enscantine.repository.AuthRepository;
import ma.fst.enscantine.session.SessionManager;

public class LoginActivity extends AppCompatActivity {

    EditText emailInput, passwordInput;
    Button loginBtn;

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

        // ✅ FIX HERE
        repo = new AuthRepository(session);

        loginBtn.setOnClickListener(v -> loginUser());
    }

    private void loginUser() {

        String email = emailInput.getText().toString();
        String password = passwordInput.getText().toString();

        MutableLiveData<LoginResponse> result = new MutableLiveData<>();

        repo.login(email, password, result);

        result.observe(this, response -> {

            if (response != null && response.token != null) {

                // Save JWT token
                session.saveToken(response.token);

                Toast.makeText(this, "Login Success", Toast.LENGTH_SHORT).show();

                Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                startActivity(intent);
                finish();

            } else {
                Toast.makeText(this, "Login Failed", Toast.LENGTH_SHORT).show();
            }
        });
    }
}