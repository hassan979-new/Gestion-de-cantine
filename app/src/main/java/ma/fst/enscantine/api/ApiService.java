package ma.fst.enscantine.api;

import java.util.List;
import java.util.Map;

import ma.fst.enscantine.entities.LoginRequest;
import ma.fst.enscantine.entities.LoginResponse;
import ma.fst.enscantine.entities.Menu;
import ma.fst.enscantine.entities.OrderRequest;
import ma.fst.enscantine.entities.OrderResponse;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface ApiService {

    // AUTH
    @POST("api/auth/login")
    Call<LoginResponse> login(@Body LoginRequest request);

    @POST("api/auth/register")
    Call<LoginResponse> register(@Body LoginRequest request);

    // MENUS
    @GET("api/menus/today")
    Call<List<Menu>> getTodayMenus();

    // ORDERS
    @POST("api/orders")
    Call<OrderResponse> createOrder(@Body OrderRequest request);

    @GET("api/orders")
    Call<List<ma.fst.enscantine.entities.Order>> getOrders();

    @PUT("api/orders/{id}")
    Call<Void> updateStatus(@Path("id") int orderId, @Body Map<String, String> body);
}