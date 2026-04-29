package ma.fst.enscantine.repository;

import androidx.lifecycle.MutableLiveData;

import java.util.ArrayList;
import java.util.List;

import ma.fst.enscantine.api.ApiClient;
import ma.fst.enscantine.api.ApiService;
import ma.fst.enscantine.entities.Menu;
import ma.fst.enscantine.entities.OrderItem;
import ma.fst.enscantine.entities.OrderRequest;
import ma.fst.enscantine.entities.OrderResponse;
import ma.fst.enscantine.session.SessionManager;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MenuRepository {

    private ApiService api;

    public MenuRepository(SessionManager sessionManager) {
        api = ApiClient.getClient(sessionManager)
                .create(ApiService.class);
    }

    public void getTodayMenus(MutableLiveData<List<Menu>> data) {

        api.getTodayMenus().enqueue(new Callback<List<Menu>>() {
            @Override
            public void onResponse(Call<List<Menu>> call, Response<List<Menu>> response) {
                data.setValue(response.body());
            }

            @Override
            public void onFailure(Call<List<Menu>> call, Throwable t) {
                data.setValue(null);
            }
        });
    }

    public MutableLiveData<String> createOrder(int userId, Menu menu, int qty) {

        MutableLiveData<String> result = new MutableLiveData<>();

        double price = Double.parseDouble(menu.price);
        double subtotal = price * qty;

        List<OrderItem> items = new ArrayList<>();
        items.add(new OrderItem(menu.id, qty, subtotal));

        OrderRequest request = new OrderRequest(userId, items, subtotal);

        api.createOrder(request).enqueue(new Callback<OrderResponse>() {
            @Override
            public void onResponse(Call<OrderResponse> call, Response<OrderResponse> response) {
                if (response.isSuccessful()) {
                    result.setValue("Commande envoyée");
                } else {
                    result.setValue("Erreur serveur");
                }
            }

            @Override
            public void onFailure(Call<OrderResponse> call, Throwable t) {
                result.setValue("Erreur réseau");
            }
        });

        return result;
    }
}