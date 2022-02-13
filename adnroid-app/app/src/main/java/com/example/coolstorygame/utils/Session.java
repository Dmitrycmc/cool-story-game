package com.example.coolstorygame.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import com.example.coolstorygame.schema.response.Questions;
import com.example.coolstorygame.schema.response.Room;

public class Session {
    private final SharedPreferences prefs;

    public enum Field {
        playerId,
        playerToken,
        room,
        roomToken,
        questions,
        status
    }

    public Session(Context cntx) {
        prefs = PreferenceManager.getDefaultSharedPreferences(cntx);
    }

    public String getString(Field key) {
        return prefs.getString(key.toString(), "");
    }

    public void setString(Field key, String value) {
        StringBuilder sb = new StringBuilder();

        sb.append(" ").append("\n")
                .append("==== Storage ====").append("\n")
                .append("Key: ").append(key).append("\n")
                .append("Value: ").append(value);

        System.out.println(sb);
        prefs.edit().putString(key.toString(), value).commit();
    }

    public Room getRoom() {
        return Room.fromJson(prefs.getString(Field.room.toString(), ""));
    }

    public void setRoom(Room room) {
        StringBuilder sb = new StringBuilder();

        sb.append(" ").append("\n")
                .append("==== Storage ====").append("\n")
                .append("Key: ").append(Field.room).append("\n")
                .append("Value: ").append(room);

        System.out.println(sb);
        prefs.edit().putString(Field.room.toString(), room.toJson()).commit();
    }

    public void setQuestions(Questions questions) {
        String key = Field.questions.toString();
        StringBuilder sb = new StringBuilder();

        sb.append(" ").append("\n")
                .append("==== Storage ====").append("\n")
                .append("Key: ").append(key).append("\n")
                .append("Value: ").append(questions);

        System.out.println(sb);
        prefs.edit().putString(key, questions.toJson()).commit();
    }

    public Questions getQuestions() {
        return Questions.fromJson(getString(Field.questions));
    }

    public boolean has(Field key) {
        return prefs.contains(key.toString());
    }

    public void clearAll() {
        StringBuilder sb = new StringBuilder();

        sb.append(" ").append("\n")
                .append("==== Storage ====").append("\n")
                .append("Cleared all");

        System.out.println(sb);

        prefs.edit().clear().apply();
    }
}
