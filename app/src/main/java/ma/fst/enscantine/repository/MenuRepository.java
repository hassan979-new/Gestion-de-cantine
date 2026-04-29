package ma.fst.enscantine.repository;

import androidx.lifecycle.MutableLiveData;

import java.util.List;

import ma.fst.enscantine.api.ApiClient;
import ma.fst.enscantine.api.ApiService;
import ma.fst.enscantine.entities.Menu;
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
}