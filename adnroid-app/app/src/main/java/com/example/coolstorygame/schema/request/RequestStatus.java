package com.example.coolstorygame.schema.request;

import com.example.coolstorygame.schema.ToJson;
import com.google.gson.Gson;

public class RequestStatus extends ToJson {
    private String playerId;
    private String token;

    public RequestStatus(String playerId, String token) {
        this.playerId = playerId;
        this.token = token;
    }

    public RequestStatus() {
    }

    public String toJson() {
        Gson g = new Gson();
        return g.toJson(this);
    }
}
