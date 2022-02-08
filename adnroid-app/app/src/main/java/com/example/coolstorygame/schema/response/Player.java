package com.example.coolstorygame.schema.response;

import com.google.gson.Gson;

import java.util.List;

public class Player {
    public String id;
    public String name;
    public String token;
    public String roomId;
    public List<String> answerSet;

    public static Player fromJson(String json) {
        Gson g = new Gson();
        return g.fromJson(json, Player.class);
    }

    @Override
    public String toString() {
        return "Player{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", token='" + token + '\'' +
                ", roomId='" + roomId + '\'' +
                ", answerSet=" + answerSet +
                '}';
    }
}
