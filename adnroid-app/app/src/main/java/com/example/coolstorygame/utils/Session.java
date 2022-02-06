package com.example.coolstorygame.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

public class Session {
    private SharedPreferences prefs;

    public Session(Context cntx) {
        prefs = PreferenceManager.getDefaultSharedPreferences(cntx);
    }

    public String getRoomToken() {
        return prefs.getString("roomToken","");
    }

    public void setRoomToken(String username) {
        prefs.edit().putString("roomToken", username).apply();
    }

    public String getPlayerId() {
        return prefs.getString("playerId","");
    }

    public void setPlayerId(String username) {
        prefs.edit().putString("playerId", username).apply();
    }

    public String getPlayerToken() {
        return prefs.getString("playerToken","");
    }

    public void setPlayerToken(String username) {
        prefs.edit().putString("playerToken", username).apply();
    }
}
