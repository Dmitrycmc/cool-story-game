package com.example.coolstorygame.api;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Response;

public interface SuccessHandler {
    void onResponse(Call call, Response response) throws IOException;
}
