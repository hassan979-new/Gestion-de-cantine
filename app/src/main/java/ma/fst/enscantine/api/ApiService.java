package ma.fst.enscantine.api;

import ma.fst.enscantine.entities.LoginRequest;
import ma.fst.enscantine.entities.LoginResponse;
import ma.fst.enscantine.entities.Menu;
import ma.fst.enscantine.entities.Order;
import ma.fst.enscantine.entities.OrderRequest;
import ma.fst.enscantine.entities.OrderResponse;
import ma.fst.enscantine.entities.RegisterRequest;
import ma.fst.enscantine.entities.User;
import retrofit2.Call;
import retrofit2.http.POST;
import java.util.List;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;

public interface ApiService {

    @POST("auth/login")
    Call<LoginResponse> login(@Body LoginRequest request);

    @POST("auth/register")
    Call<LoginResponse> register(@Body RegisterRequest request);

    @GET("auth/me")
    Call<User> getMe(@Header("Authorization") String token);


    // MENUS
    @GET("menus/today")
    Call<List<Menu>> getTodayMenus();

    @GET("menus/")
    Call<List<Menu>> getMenus();


    // ORDERS
    @POST("orders/")
    Call<OrderResponse> createOrder(@Body OrderRequest request);

    @GET("orders/")
    Call<List<Order>> getOrders();
}
