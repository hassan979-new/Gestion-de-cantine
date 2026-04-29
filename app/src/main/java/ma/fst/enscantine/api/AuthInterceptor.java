package ma.fst.enscantine.api;

import androidx.annotation.NonNull;

import java.io.IOException;

import ma.fst.enscantine.session.SessionManager;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {

    private SessionManager session;

    public AuthInterceptor(SessionManager session){
        this.session = session;
    }

    @Override
    public Response intercept(Chain chain) throws IOException {

        String token = session.getToken();

        Request request = chain.request();

        if (token != null) {
            request = request.newBuilder()
                    .addHeader("Authorization", "Bearer " + token)
                    .build();
        }

        return chain.proceed(request);
    }
}
