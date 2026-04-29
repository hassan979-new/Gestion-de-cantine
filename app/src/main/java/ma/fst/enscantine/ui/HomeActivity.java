package ma.fst.enscantine.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;

import java.util.List;

import ma.fst.enscantine.R;
import ma.fst.enscantine.api.ApiClient;
import ma.fst.enscantine.api.ApiService;
import ma.fst.enscantine.entities.Menu;
import ma.fst.enscantine.session.SessionManager;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HomeActivity extends AppCompatActivity {

    private TextView txtMenuPreview;
    private MaterialButton btnViewMenu;
    private com.google.android.material.card.MaterialCardView btnOrders, btnProfile;

    private ApiService api;
    private SessionManager session;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        session = new SessionManager(this);

        if (session.getToken() == null) {
            goToLogin();
            return;
        }

        txtMenuPreview = findViewById(R.id.txtMenuPreview);
        btnViewMenu = findViewById(R.id.btnViewMenu);
        btnOrders = findViewById(R.id.btnOrders);

        btnProfile = findViewById(R.id.btnProfile);


        api = ApiClient.getClient(session).create(ApiService.class);

        loadMenuPreview();

        btnViewMenu.setOnClickListener(v -> {
            startActivity(new Intent(this, MenuActivity.class));
        });

        btnOrders.setOnClickListener(v -> {
            startActivity(new Intent(this, OrdersActivity.class));
        });

        btnProfile.setOnClickListener(v ->
                startActivity(new Intent(this, ProfileActivity.class))
        );
    }

    private void loadMenuPreview() {
        api.getTodayMenus().enqueue(new Callback<List<Menu>>() {
            @Override
            public void onResponse(Call<List<Menu>> call, Response<List<Menu>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Menu> menus = response.body();

                    if (menus.isEmpty()) {
                        txtMenuPreview.setText("Aucun menu aujourd'hui");
                        return;
                    }

                    StringBuilder preview = new StringBuilder();

                    for (int i = 0; i < Math.min(2, menus.size()); i++) {
                        preview.append("• ")
                                .append(menus.get(i).name)
                                .append("\n");
                    }

                    txtMenuPreview.setText(preview.toString());

                } else if (response.code() == 401) {
                    session.clear();
                    goToLogin();
                } else {
                    txtMenuPreview.setText("Erreur chargement menu");
                }
            }

            @Override
            public void onFailure(Call<List<Menu>> call, Throwable t) {
                txtMenuPreview.setText("Erreur réseau");
            }
        });
    }

    private void goToLogin() {
        startActivity(new Intent(this, LoginActivity.class));
        finish();
    }
}