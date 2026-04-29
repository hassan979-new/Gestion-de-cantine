package ma.fst.enscantine.repository;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;

import com.google.gson.Gson;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import ma.fst.enscantine.api.ApiClient;
import ma.fst.enscantine.api.ApiService;
import ma.fst.enscantine.entities.Order;
import ma.fst.enscantine.session.SessionManager;
import retrofit2.*;

public class OrdersRepository {

    private ApiService api;

    public OrdersRepository(SessionManager session) {
        api = ApiClient.getClient(session).create(ApiService.class);
    }

    public void getOrders(MutableLiveData<List<Order>> data) {

        api.getOrders().enqueue(new Callback<List<Order>>() {
            @Override
            public void onResponse(Call<List<Order>> call, Response<List<Order>> response) {
                if (response.isSuccessful()) {
                    data.setValue(response.body());
                    Log.d("API_DEBUG", new Gson().toJson(response.body()));
                } else {
                    data.setValue(null);
                }
            }

            @Override
            public void onFailure(Call<List<Order>> call, Throwable t) {
                data.setValue(null);
            }
        });
    }

    public MutableLiveData<String> updateStatus(int orderId, String status) {

        MutableLiveData<String> result = new MutableLiveData<>();

        Map<String, String> body = new HashMap<>();
        body.put("status", status);

        api.updateStatus(orderId, body).enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    result.setValue("Succès");
                } else {
                    result.setValue("Erreur");
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                result.setValue("Erreur réseau");
            }
        });

        return result;
    }
}