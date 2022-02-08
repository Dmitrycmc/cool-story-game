package com.example.coolstorygame.schema;

import com.google.gson.Gson;

public class ToJson {
    public String toJson() {
        Gson g = new Gson();
        return g.toJson(this);
    }
}
