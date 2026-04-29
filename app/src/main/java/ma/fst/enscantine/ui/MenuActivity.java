package ma.fst.enscantine.ui;

import android.app.AlertDialog;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.button.MaterialButton;

import java.util.ArrayList;
import java.util.List;

import ma.fst.enscantine.R;
import ma.fst.enscantine.adapter.MenuAdapter;
import ma.fst.enscantine.api.ApiClient;
import ma.fst.enscantine.api.ApiService;
import ma.fst.enscantine.entities.Menu;
import ma.fst.enscantine.entities.OrderItem;
import ma.fst.enscantine.entities.OrderRequest;
import ma.fst.enscantine.entities.OrderResponse;
import ma.fst.enscantine.session.SessionManager;
import ma.fst.enscantine.ui.MenuViewModel;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MenuActivity extends AppCompatActivity {


    private ApiService api;
    private SessionManager session;
    RecyclerView recyclerView;
    MenuAdapter adapter;
    ma.fst.enscantine.ui.MenuViewModel viewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_menu);

        session = new SessionManager(this);
        api = ApiClient.getClient(session).create(ApiService.class);

        recyclerView = findViewById(R.id.recyclerMenus);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        adapter = new MenuAdapter(new ArrayList<>(), this::createOrder);
        recyclerView.setAdapter(adapter);

        viewModel = new ViewModelProvider(this).get(MenuViewModel.class);

        viewModel.getMenus().observe(this, menus -> {
            if (menus != null) {
                Log.d("MENUS_DEBUG", "Size: " + menus.size());
                adapter.updateData(menus);
            } else {
                Toast.makeText(this, "Erreur chargement menus", Toast.LENGTH_SHORT).show();
            }
        });

        viewModel.loadMenus();
    }

    private void createOrder(Menu menu) {


        View dialogView = LayoutInflater.from(this)
                .inflate(R.layout.dialog_order, null);


        TextView txtName      = dialogView.findViewById(R.id.dialogMenuName);
        TextView txtPrice     = dialogView.findViewById(R.id.dialogMenuPrice);
        TextView txtQuantity  = dialogView.findViewById(R.id.txtQuantity);
        TextView txtTotal     = dialogView.findViewById(R.id.txtTotal);
        MaterialButton btnInc = dialogView.findViewById(R.id.btnIncrement);
        MaterialButton btnDec = dialogView.findViewById(R.id.btnDecrement);


        txtName.setText(menu.name);
        txtPrice.setText(menu.price + " DH / unité");

        final int[] quantity = {1};


        double unitPrice = Double.parseDouble(menu.price);

        Runnable refresh = () -> {
            txtQuantity.setText(String.valueOf(quantity[0]));
            txtTotal.setText(String.format("%.2f DH", unitPrice * quantity[0]));
        };

        refresh.run();

        btnInc.setOnClickListener(v -> {
            if (quantity[0] < 10) {
                quantity[0]++;
                refresh.run();
            }
        });

        btnDec.setOnClickListener(v -> {
            if (quantity[0] > 1) {
                quantity[0]--;
                refresh.run();
            }
        });

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(dialogView)
                .setPositiveButton("Confirmer", null)
                .setNegativeButton("Annuler", (d, w) -> d.dismiss())
                .create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        }

        dialog.setOnShowListener(d -> {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v -> {

                dialog.getButton(AlertDialog.BUTTON_POSITIVE).setEnabled(false);
                dialog.getButton(AlertDialog.BUTTON_POSITIVE).setText("Envoi...");

                viewModel.createOrder(
                        session.getUserId(),
                        menu.id,
                        quantity[0]
                ).observe(this, result -> {
                    if (result == null) return;

                    if (result.equals("Commande confirmée !")) {
                        dialog.dismiss();
                        Toast.makeText(this, result, Toast.LENGTH_SHORT).show();
                        finish();
                    } else {
                        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setEnabled(true);
                        dialog.getButton(AlertDialog.BUTTON_POSITIVE).setText("Confirmer");
                        Toast.makeText(this, result, Toast.LENGTH_SHORT).show();
                    }
                });
            });
        });

        dialog.show();
    }

}