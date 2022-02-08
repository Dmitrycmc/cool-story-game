package com.example.coolstorygame.schema.request;

import com.example.coolstorygame.schema.ToJson;
import com.google.gson.Gson;

public class RequestStart extends ToJson {
    private String token;

    public RequestStart(String token) {
        this.token = token;
    }

    public String toJson() {
        Gson g = new Gson();
        return g.toJson(this);
    }
}
