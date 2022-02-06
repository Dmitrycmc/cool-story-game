package com.example.coolstorygame.schema.request;

import com.example.coolstorygame.schema.ToJson;
import com.google.gson.Gson;

public class RequestRegister extends ToJson {
    String name;

    public RequestRegister(String name) {
        this.name = name;
    }

    public String toJson() {
        Gson g = new Gson();
        return g.toJson(this);
    }
}
