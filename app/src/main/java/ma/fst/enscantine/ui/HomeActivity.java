package ma.fst.enscantine.ui;

import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

import ma.fst.enscantine.R;
import ma.fst.enscantine.adapter.MenuAdapter;
import ma.fst.enscantine.api.ApiClient;
import ma.fst.enscantine.api.ApiService;
import ma.fst.enscantine.entities.Menu;
import ma.fst.enscantine.entities.OrderRequest;
import ma.fst.enscantine.entities.OrderResponse;

import ma.fst.enscantine.session.SessionManager;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class HomeActivity extends AppCompatActivity {

    RecyclerView recyclerView;
    MenuAdapter adapter;

    ApiService api;

    List<Menu> menuList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        recyclerView = findViewById(R.id.recyclerMenus);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        SessionManager session = new SessionManager(this);

        api = ApiClient.getClient(session).create(ApiService.class);

        loadMenus();
    }

    private void loadMenus() {

        api.getTodayMenus().enqueue(new Callback<List<Menu>>() {
            @Override
            public void onResponse(Call<List<Menu>> call, Response<List<Menu>> response) {

                if (response.isSuccessful() && response.body() != null) {

                    menuList = response.body();

                    adapter = new MenuAdapter(menuList, menu -> {
                        createOrder(menu);
                    });

                    recyclerView.setAdapter(adapter);

                } else {
                    Toast.makeText(HomeActivity.this,
                            "No menu available",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Menu>> call, Throwable t) {
                Toast.makeText(HomeActivity.this,
                        "Error loading menu",
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void createOrder(Menu menu) {

        OrderRequest request = new OrderRequest(menu.id, 1);

        api.createOrder(request).enqueue(new Callback<OrderResponse>() {
            @Override
            public void onResponse(Call<OrderResponse> call, Response<OrderResponse> response) {

                if (response.isSuccessful() && response.body() != null) {

                    Toast.makeText(HomeActivity.this,
                            "Order placed",
                            Toast.LENGTH_SHORT).show();

                } else {
                    Toast.makeText(HomeActivity.this,
                            "Order failed",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<OrderResponse> call, Throwable t) {
                Toast.makeText(HomeActivity.this,
                        "Network error",
                        Toast.LENGTH_SHORT).show();
            }
        });
    }
}