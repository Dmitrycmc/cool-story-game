package com.example.coolstorygame.schema.response;

import com.example.coolstorygame.schema.ToJson;
import com.google.gson.Gson;

import java.util.List;

public class Questions extends ToJson {
    public String id;
    public List<String> questions;

    public static Questions fromJson(String json) {
        Gson g = new Gson();
        return g.fromJson(json, Questions.class);
    }

    @Override
    public String toString() {
        return "Questions{" +
                "id='" + id + '\'' +
                ", questions=" + questions +
                '}';
    }
}
