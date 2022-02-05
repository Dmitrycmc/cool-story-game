package com.example.coolstorygame.schema.response;

import com.google.gson.Gson;

import java.util.List;

public class Room {
    public String id;
    public Status status;
    public String token;
    public List<String> playerIds;
    public int currentPlayerNumber;
    public int questionsNumber;
    public String questionsSetId;
    public int currentQuestionNumber;
    public Number turn;

    public static Room fromJson(String json) {
        Gson g = new Gson();
        return g.fromJson(json, Room.class);
    }

    @Override
    public String toString() {
        return "Room{" +
                "id='" + id + '\'' +
                ", status=" + status +
                ", token='" + token + '\'' +
                ", playerIds=" + playerIds +
                ", currentPlayerNumber=" + currentPlayerNumber +
                ", questionsNumber=" + questionsNumber +
                ", questionsSetId='" + questionsSetId + '\'' +
                ", currentQuestionNumber=" + currentQuestionNumber +
                ", turn=" + turn +
                '}';
    }
}
