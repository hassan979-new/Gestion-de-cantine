package ma.fst.enscantine.api;

import ma.fst.enscantine.session.SessionManager;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {
    private static final String BASE_URL = "http://10.0.2.2:5000/";

    public static Retrofit getClient(SessionManager sessionManager) {

        return new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .client(getOkHttpClient(sessionManager))
                .build();
    }

    private static OkHttpClient getOkHttpClient(SessionManager sessionManager) {

        return new OkHttpClient.Builder()
                .addInterceptor(chain -> {

                    Request original = chain.request();

                    Request.Builder builder = original.newBuilder();

                    String token = sessionManager.getToken();

                    if (token != null) {
                        builder.addHeader("Authorization", "Bearer " + token);
                    }

                    return chain.proceed(builder.build());
                })
                .build();
    }
}