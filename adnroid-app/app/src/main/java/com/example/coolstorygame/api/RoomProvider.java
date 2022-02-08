package com.example.coolstorygame.api;

import androidx.annotation.NonNull;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class RoomProvider {
    private static final String API_URL = "https://cool-story-game.herokuapp.com/api/v1/";

    public static void post(String endpoint, String requestBody, SuccessHandler successHandler, FailureHandler failureHandler) {
        OkHttpClient client = new OkHttpClient();

        String url = API_URL + "room/" + endpoint;

        client.newCall(
                new Request.Builder()
                        .url(url)
                        .post(RequestBody.create(MediaType.parse("application/json; charset=utf-8"), requestBody))
                        .build()
        ).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                failureHandler.onFailure(e);
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                Integer code = response.code();
                String responseBody = response.body().string();

                StringBuilder sb = new StringBuilder();

                sb.append(" ").append("\n")
                    .append("==== Request ====").append("\n")
                    .append("POST ").append(url).append("\n")
                    .append("Body: ").append(requestBody).append("\n")
                    .append("==== Response ====").append("\n")
                    .append("Status: ").append(code).append("\n")
                    .append("Body: ").append(responseBody);

                System.out.println(sb);

                successHandler.onResponse(code, responseBody);
            }
        });
    }

    public static void post(String endpoint, String body, SuccessHandler successHandler) {
        post(endpoint, body, successHandler, e -> {});
    }

    public static void post(String endpoint, String body) {
        post(endpoint, body, (code, body1) -> {});
    }
}
