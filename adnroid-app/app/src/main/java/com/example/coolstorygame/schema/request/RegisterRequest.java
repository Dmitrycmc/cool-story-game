package com.example.coolstorygame.schema.request;

import com.example.coolstorygame.schema.ToJson;
import com.google.gson.Gson;

public class RegisterRequest extends ToJson {
    String name;

    public RegisterRequest(String name) {
        this.name = name;
    }

    public String toJson() {
        Gson g = new Gson();
        return g.toJson(this);
    }
}
