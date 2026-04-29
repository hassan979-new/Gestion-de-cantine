package ma.fst.enscantine.repository;

import androidx.lifecycle.MutableLiveData;

import ma.fst.enscantine.api.ApiClient;
import ma.fst.enscantine.api.ApiService;
import ma.fst.enscantine.entities.LoginRequest;
import ma.fst.enscantine.entities.LoginResponse;
import ma.fst.enscantine.session.SessionManager;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AuthRepository {
    private ApiService api;

    public AuthRepository(SessionManager sessionManager) {
        api = ApiClient.getClient(sessionManager)
                .create(ApiService.class);
    }

    public void login(String email, String password, MutableLiveData<LoginResponse> result) {

        api.login(new LoginRequest(email, password))
                .enqueue(new Callback<LoginResponse>() {

                    @Override
                    public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                        result.setValue(response.body());
                    }

                    @Override
                    public void onFailure(Call<LoginResponse> call, Throwable t) {
                        result.setValue(null);
                    }
                });
    }
}