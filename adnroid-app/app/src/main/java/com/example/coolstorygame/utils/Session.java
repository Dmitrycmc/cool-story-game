package com.example.coolstorygame.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

public class Session {
    private final SharedPreferences prefs;

    public enum Field {
        roomId,
        roomToken,
        playerId,
        playerToken
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
