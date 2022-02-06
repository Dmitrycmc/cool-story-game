package com.example.coolstorygame.api;

import java.io.IOException;

public interface FailureHandler {
    void onFailure(IOException e);
}
