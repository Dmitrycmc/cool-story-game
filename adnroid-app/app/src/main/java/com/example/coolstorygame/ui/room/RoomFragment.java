package com.example.coolstorygame.ui.room;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;

import com.example.coolstorygame.databinding.FragmentRoomBinding;

public class RoomFragment extends Fragment {

    private RoomViewModel roomViewModel;
    private FragmentRoomBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        roomViewModel =
                new ViewModelProvider(this).get(RoomViewModel.class);

        binding = FragmentRoomBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textRoom;
        roomViewModel.getText().observe(getViewLifecycleOwner(), new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                textView.setText(s);
            }
        });
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}