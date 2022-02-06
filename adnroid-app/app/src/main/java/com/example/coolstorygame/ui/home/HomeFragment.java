package com.example.coolstorygame.ui.home;

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

import com.example.coolstorygame.R;
import com.example.coolstorygame.api.RoomProvider;
import com.example.coolstorygame.databinding.FragmentHomeBinding;
import com.example.coolstorygame.schema.request.RequestCreate;
import com.example.coolstorygame.schema.request.RequestRegister;
import com.example.coolstorygame.schema.response.Player;
import com.example.coolstorygame.schema.response.Room;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Response;

public class HomeFragment extends Fragment {

    private HomeViewModel homeViewModel;
    private FragmentHomeBinding binding;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        homeViewModel =
                new ViewModelProvider(this).get(HomeViewModel.class);

        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final TextView textView = binding.textStatus;
        homeViewModel.getText().observe(getViewLifecycleOwner(), new Observer<String>() {
            @Override
            public void onChanged(@Nullable String s) {
                textView.setText(s);
            }
        });
        return root;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        binding.buttonRegister.setOnClickListener(this::handleRegister);
        binding.floatingActionButtonCreateRoom.setOnClickListener(this::handleCreateRoom);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();

        binding = null;
    }

    private void handleCreateRoom(View v) {
        String body = new RequestCreate().toJson();

        RoomProvider.post(  "new", body, this::onCreateRoom);
    }

    public void onCreateRoom(Call call, final Response response) throws IOException {
        String body = response.body().string();

        if (response.code() == 200) {
            Room room = Room.fromJson(body);

            getActivity().runOnUiThread(() -> {
                ((FloatingActionButton) getActivity().findViewById(R.id.floatingActionButtonCreateRoom)).setVisibility(View.INVISIBLE);
                ((TextView) getActivity().findViewById(R.id.editTextRoomId)).setText(room.id);
            });
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append(response.code()).append(": ").append(body);

            getActivity().runOnUiThread(() -> {
                ((TextView) getActivity().findViewById(R.id.textStatus)).setText(sb);
            });
        }
    }

    private void handleRegister(View v) {
        String roomId = binding.editTextRoomId.getText().toString();
        String name = binding.editTextPlayerName.getText().toString();
        String body = new RequestRegister(name).toJson();

        RoomProvider.post(roomId + "/register", body, this::onRegister);
    }

    public void onRegister(Call call, final Response response) throws IOException {
        String body = response.body().string();

        if (response.code() == 200) {
            Player person = Player.fromJson(body);

            getActivity().runOnUiThread(() -> {
                // todo
                ((TextView) getActivity().findViewById(R.id.textStatus)).setText(person.toString());
            });
        } else {
            StringBuilder sb = new StringBuilder();
            sb.append(response.code()).append(": ").append(body);

            getActivity().runOnUiThread(() -> {
                ((TextView) getActivity().findViewById(R.id.textStatus)).setText(sb);
            });
        }
    }
}