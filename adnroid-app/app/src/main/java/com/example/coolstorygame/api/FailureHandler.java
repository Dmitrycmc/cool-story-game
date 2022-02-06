package com.example.coolstorygame.api;

import java.io.IOException;

import okhttp3.Call;

public interface FailureHandler {
    void onFailure(final Call call, IOException e);
}
