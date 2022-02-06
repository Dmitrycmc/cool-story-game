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
    public static void post(String endpoint, String body, SuccessHandler successHandler, FailureHandler failureHandler) {
        OkHttpClient client = new OkHttpClient();
        client.newCall(
                new Request.Builder()
                        .url("https://cool-story-game.herokuapp.com/api/v1/room/" + endpoint)
                        .post(RequestBody.create(MediaType.parse("application/json; charset=utf-8"), body))
                        .build()
        ).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                failureHandler.onFailure(call, e);
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                successHandler.onResponse(call, response);
            }
        });
    }

    public static void post(String endpoint, String body, SuccessHandler successHandler) {
        post(endpoint, body, successHandler, new FailureHandler() {
            @Override
            public void onFailure(Call call, IOException e) {}
        });
    }
}
