package ma.fst.enscantine.ui;

import android.app.AlertDialog;
import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

import ma.fst.enscantine.R;
import ma.fst.enscantine.adapter.OrdersAdapter;
import ma.fst.enscantine.entities.Order;

public class OrdersActivity extends AppCompatActivity {

    RecyclerView recycler;
    OrdersViewModel viewModel;
    OrdersAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_orders);

        recycler = findViewById(R.id.recyclerOrders);
        recycler.setLayoutManager(new LinearLayoutManager(this));

        adapter = new OrdersAdapter(new ArrayList<>(), this::cancelOrder);
        recycler.setAdapter(adapter);

        viewModel = new ViewModelProvider(this).get(OrdersViewModel.class);

        viewModel.getOrders().observe(this, orders -> {
            if (orders != null && !orders.isEmpty()) {
                adapter.updateData(orders);
            } else {
                Toast.makeText(this, "Aucune commande", Toast.LENGTH_SHORT).show();
            }
        });

        viewModel.loadOrders();
    }


    private void cancelOrder(Order order) {

        new AlertDialog.Builder(this)
                .setTitle("Annuler commande")
                .setMessage("Voulez-vous annuler cette commande ?")
                .setPositiveButton("Oui", (d, w) -> {

                    viewModel.cancelOrder(order.id)
                            .observe(this, result -> {
                                Toast.makeText(this, result, Toast.LENGTH_SHORT).show();
                                viewModel.loadOrders();
                            });

                })
                .setNegativeButton("Non", null)
                .show();
    }
}