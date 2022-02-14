package com.example.coolstorygame.schema.request;

import com.example.coolstorygame.schema.ToJson;
import com.google.gson.Gson;

public class RequestAnswer extends ToJson {
    String playerId;
    String token;
    String answer;

    public RequestAnswer(String playerId, String token, String answer) {
        this.playerId = playerId;
        this.token = token;
        this.answer = answer;
    }

    public String toJson() {
        Gson g = new Gson();
        return g.toJson(this);
    }
}
