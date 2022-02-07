package com.example.coolstorygame.ui.outer;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class OuterViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public OuterViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is outer fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}