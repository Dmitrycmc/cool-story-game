package com.example.coolstorygame.schema.request;

import com.example.coolstorygame.schema.ToJson;
import com.google.gson.Gson;

public class RequestCreate extends ToJson {
    public RequestCreate() {
    }

    public String toJson() {
        Gson g = new Gson();
        return g.toJson(this);
    }
}
